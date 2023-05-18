const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    } else {
        res.status(200).json(users);
    }
});

// @desc    Get user by id
// @route   GET /api/users
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .lean()
        .exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, nickname, profilePic } = req.body;
    const isSSO = req.isSSO || false;
    // Confirm data
    if (!username || !email || (!isSSO && !password)) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check for duplicate username
    let duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Username' });
    }
    duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Email' });
    }
    // Generate a random password for SSO users
    const randomPassword = crypto.randomBytes(16).toString('hex');
    // Hash password
    const hashedPwd = isSSO
        ? await bcrypt.hash(randomPassword, 10)
        : await bcrypt.hash(password, 10); // salt rounds

    // Create and store new user
    const user = await User.create({
        username: username,
        email: email,
        password: hashedPwd,
        roles: 1,
        nickname: nickname ? nickname : username,
        // profilePic: profilePic, //TODO: Add profile pic to User model
    });
    if (user) {
        await user.save();
        if (isSSO) {
            return user;
        }
        // created
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// @desc    Update user
// @route   PUT /api/users
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const { email, username, password, nickname } = req.body;
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    user.email = email || user.email;
    user.nickname = nickname || user.nickname;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
    });
});

// @desc    Delete user
// @route   DELETE /api/users
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const { id, isDelete } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }
    // Does the user exist to delete?
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    let reply;
    if (isDelete) {
        const result = await user.deleteOne();
        reply = `Username ${result.username} with ID ${result._id} deleted`;
    } else {
        user.active = false;
        await user.save();
        reply = `Username ${user.username} with ID ${user._id} deactivated`;
    }
    res.status(200).json(reply);
});

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    deleteUser,
};
