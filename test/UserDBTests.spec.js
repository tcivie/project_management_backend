// import { describe, it } from 'mocha';
// import { assert } from 'chai';
require('dotenv').config();
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const { assert } = require('chai');
const User = require('../models/User');

// connect to DB
mongoose
    .connect(process.env.DBURL)
    .then(() => {
        console.log('Connected to DB');

        describe('User not found test', async () => {
            it('should return a null object when not found', async () => {
                // eslint-disable-next-line no-undef
                const user = await User.findOne({ username: '' });
                assert.equal(null, user);
            });
        });

        describe('User found test', async () => {
            it('should return a user object when found', async () => {
                // eslint-disable-next-line no-undef
                const user = await User.findOne({ username: 'omerA' });
                const found = user !== null;
                assert.equal(true, found);
            });
        });

        describe('Validate User password test', async () => {
            it('should return false for the wrong password and true for the correct password', async () => {
                // eslint-disable-next-line no-undef
                const user = await User.findOne({ username: 'omerA' });
                const wrongPass = '123456';
                const correctPass = '12345';
                assert.equal(false, await user.validPassword(wrongPass));
                assert.equal(true, await user.validPassword(correctPass));
            });
        });
        mongoose.connection.close();
        process.exit();
    })
    .catch((error) => {
        console.log(error);
    });






