require('dotenv').config();
const mongoose = require('mongoose');
const { describe, it, before, after, afterEach } = require('mocha');
const { assert } = require('chai');
const User = require('../models/User');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/App');
const { roleList } = require('../middleware/checkRoles');
const request = supertest(app);

before(async function () {
    await mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

after(async function () {
    await User.deleteOne({ username: 'testuser' });
    await mongoose.disconnect();
});
describe('POST /api/users', function () {
    it('should return 400 if username, password or email are missing', async function () {
        const res = await request.post('/api/users').send({
            username: 'testuser',
            password: 'testpassword',
            // email is missing
        });

        assert.equal(res.status, 400);
        assert.deepEqual(res.body, { message: 'All fields are required' });
    });

    it('should return 201 and create a user if valid data is provided', async function () {
        const res = await request.post('/api/users').send({
            username: 'testuser',
            password: 'testpassword',
            email: 'test@test.com',
            nickname: 'testnickname',
        });

        assert.equal(res.status, 201);
        assert.deepEqual(res.body, { message: 'New user testuser created' });

        const user = await User.findOne({ username: 'testuser' });
        assert.isNotNull(user);
        assert.equal(user.username, 'testuser');
        assert.isTrue(await user.validPassword('testpassword'));
    });

    it('should return 409 if username already exists', async function () {
        const res = await request.post('/api/users').send({
            username: 'testuser',
            password: 'testpassword',
            email: 'test@test.com',
            nickname: 'anothernickname',
        });

        assert.equal(res.status, 409);
        assert.deepEqual(res.body, { message: 'Duplicate username' });
    });
});

describe('GET /api/users', function () {
    it('should return 403 if not authorized (no JWT or invalid JWT)', async function () {
        // Test with no JWT
        let res = await request.get('/api/users');
        assert.equal(res.status, 403);

        // Test with invalid JWT
        res = await request
            .get('/api/users')
            .set('Authorization', 'Bearer some.invalid.token');
        assert.equal(res.status, 403);
    });

    it('should return 403 if authorized but with insufficient roles', async function () {
        // Test with a JWT for a user with insufficient roles (e.g., a regular user)
        const token = generateTokenWithRoles(roleList.user);
        const res = await request
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 403);
    });

    it('should return 200 and a list of users if authorized and with valid roles', async function () {
        // Test with a JWT for a user with valid roles (e.g., an admin or superAdmin)
        const token = generateTokenWithRoles(roleList.admin);
        const res = await request
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.isArray(res.body);
    });
});

describe('PATCH /api/users', function () {
    it('should return 400 if the user does not exist', async function () {
        const token = generateTokenWithRoles(roleList.admin);
        const res = await request
            .patch('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'nonexistent' });

        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'User not found');
    });

    it('should update the email of the user', async function () {
        const token = generateTokenWithRoles(roleList.user);
        const newEmail = 'newemail@example.com';
        const res = await request
            .patch('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'testuser', email: newEmail });

        assert.equal(res.status, 200);
        assert.equal(res.body.email, newEmail);
    });

    it('should update the nickname of the user', async function () {
        const token = generateTokenWithRoles(roleList.user);
        const newNickname = 'newNickname';
        const res = await request
            .patch('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'testuser', nickname: newNickname });

        assert.equal(res.status, 200);
        assert.equal(res.body.nickname, newNickname);
    });

    it('should update the password of the user', async function () {
        const token = generateTokenWithRoles(roleList.user);
        const newPassword = 'newPassword';
        const res = await request
            .patch('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'testuser', password: newPassword });

        assert.equal(res.status, 200);

        // Retrieve the user directly from the database to check the password
        const user = await User.findOne({ username: 'testuser' });
        assert.isTrue(await user.validPassword(newPassword));
    });
});

describe('DELETE /api/users', () => {
    let user;
    beforeEach(async () => {
        // Create a user for testing
        user = new User({
            username: 'testUser',
            email: 'testUser@test.com',
            password: 'testPassword',
            roles: 1,
            nickname: 'testNick',
            active: true,
        });
        await user.save();
    });

    afterEach(async () => {
        // Remove the user after testing
        await User.deleteMany();
    });

    it('Should return 400 if no user ID is provided', async () => {
        const res = await request.delete('/api/users').send({});
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'User ID Required');
    });

    it('Should return 400 if user is not found', async () => {
        const res = await request
            .delete('/api/users')
            .send({ id: new mongoose.Types.ObjectId() });
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'User not found');
    });

    it('Should delete the user if isDelete is true', async () => {
        const res = await request
            .delete('/api/users')
            .send({ id: user._id, isDelete: true });
        assert.equal(res.status, 200);
        assert.equal(
            res.body,
            `Username ${user.username} with ID ${user._id} deleted`,
        );
        const deletedUser = await User.findById(user._id);
        assert.isNull(deletedUser);
    });

    it('Should deactivate the user if isDelete is false', async () => {
        const res = await request
            .delete('/api/users')
            .send({ id: user._id, isDelete: false });
        assert.equal(res.status, 200);
        assert.equal(
            res.body,
            `Username ${user.username} with ID ${user._id} deactivated`,
        );
        const updatedUser = await User.findById(user._id);
        assert.isFalse(updatedUser.active);
    });
});

// Add a helper function to generate JWTs with specific roles for testing
function generateTokenWithRoles(roles) {
    const payload = {
        UserInfo: {
            username: 'testuser',
            roles: roles,
            active: true,
        },
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });

    return token;
}
