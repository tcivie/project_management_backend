const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});

// @desc    Get user by id
// @route   GET /api/users
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').lean().exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, nickname } = req.body
    // Confirm data
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // Create and store new user
    const user = await User.create({
        "username": username,
        "email": email,
        "password": hashedPwd,
        "roles": 0,
        "nickname": nickname? nickname : username,

    })

    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
});

// @desc    Update user
// @route   PUT /api/users
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const { email, username, password, nickname } = req.body;
    const user = await User.findById(req.params.id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    user.email = email || user.email;
    user.username = username || user.username;
    user.nickname = nickname || user.nickname;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        nickname: updatedUser.nickname,
    });
});

// @desc    Delete user
// @route   DELETE /api/users
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }
    // Does the user exist to delete?
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
});

module.exports = { getAllUsers, getUserById, registerUser, updateUser, deleteUser }