const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { differenceInSecondsWithOptions } = require('date-fns/fp');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Chat/Posts');

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.status(200).json(users);
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // Check if the the param is a list of ids
    if (req.params.id.includes(',')) {
        // console.log('GET USER BY ID - MULTIPLE');
        const ids = req.params.id.split(',');
        ids.forEach((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                // console.log('INVALID ID');
                return res.status(400).json({ message: 'Invalid id' });
            }
        });
        console.log(ids);
        const users = await User.find({ _id: { $in: ids } })
            .select('-password')
            .lean()
            .exec();
        if (!users?.length) {
            // console.log('NO USERS FOUND');
            return res.status(400).json({ message: 'No users found' });
        }
        console.log(users);
        res.status(200).json(users);
    } else {
        // console.log('GET USER BY ID - SINGLE');
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        const user = await User.findById(req.params.id)
            .select('-password')
            .lean()
            .exec();
        if (!user) {
            // console.log('USER NOT FOUND');
            return res.status(400).json({ message: 'User not found' });
        }
        res.json(user);
    }
});

// @desc    Get logged user details
// @route   GET /api/users
// @access  Private/Admin
const getMyDetails = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.user })
        .select('-password')
        .lean()
        .exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {
        username, password, email, nickname,
    } = req.body;
    const avatar = req.file?.path;
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
        username,
        email,
        password: hashedPwd,
        roles: 1,
        nickname: nickname || username,
        avatar: avatar || null,
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
    const {
        email, username, password, nickname,
    } = req.body;
    const avatar = req.file?.path;
    const user = await User.findOne({ username }).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    user.email = email || user.email;
    user.nickname = nickname || user.nickname;
    user.avatar = avatar || user.avatar;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        avatar: updatedUser.avatar,
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
    return res.status(200).json(reply);
});

// @desc    Follow user
// @route   POST /api/users/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }
    // Does the user exist to follow?
    const user = await User.findOne({ id }).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    // Check if the user is already followed
    const isFollowed = user.followers.includes(req.user);
    if (isFollowed) {
        return res.status(400).json({ message: 'Already followed' });
    }
    // Follow the user
    const follower = await User.findOne({ id: req.user.id }).exec();
    follower.following.push(id);
    user.followers.push(follower._id);
    await follower.save();
    await user.save();
    return res.status(200).json({ message: 'Followed' });
});

// @desc    Unfollow user
// @route   POST /api/users/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }
    // Does the user exist to unfollow?
    const user = await User.findOne({ id: req.user.id }).exec();
    const userToUnfollow = await User.findOne({ id }).exec();
    if (!user || !userToUnfollow) {
        return res.status(400).json({ message: 'User not found' });
    }
    // Check if the user is already followed
    const isFollowed = user.following.includes(id);
    if (!isFollowed) {
        return res.status(400).json({ message: 'Not followed' });
    }
    // Unfollow the user
    user.following.pull(id);
    userToUnfollow.followers.pull(req.user.id);
    await user.save();
    await userToUnfollow.save();
    return res.status(200).json({ message: 'Unfollowed' });
});

// @desc    save Post
// @route   POST /api/users/savePost
// @access  Private
const savePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.status(400).json({ message: 'Post ID Required' });
    }
    // Does the post exist to save?
    const post = await Post.findOne({ _id: postId }).exec();
    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }
    // Get user
    const savingUser = await User.findOne({ id: req.user.id }).exec();
    // Check if the post is already saved
    const isSaved = savingUser.savedPosts.includes(postId);
    if (isSaved) {
        return res.status(200).json({ message: 'Already saved' });
    }
    // Save the post
    savingUser.savedPosts.push(postId);
    post.saves.push(savingUser._id);
    await savingUser.save();
    await post.save();
    return res.status(200).json({ message: 'Saved' });
});

// @desc    UnSave post
// @route   POST /api/users/unSavePost
// @access  Private
const unSavePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.status(400).json({ message: 'Post ID Required' });
    }
    // Does the post exist to unsave?
    const postToUnSave = await Post.findOne({ _id: postId }).exec();
    if (!postToUnSave) {
        return res.status(400).json({ message: 'Post not found' });
    }
    // Get user
    const user = await User.findOne({ id: req.user.id }).exec();
    // Check if the post is already saved
    const isSaved = user.savedPosts.includes(postId);
    if (!isSaved) {
        return res.status(400).json({ message: 'Not saved' });
    }
    // Unsave the post
    user.savedPosts.pull(postId);
    postToUnSave.saves.pull(user._id);
    await user.save();
    await postToUnSave.save();
    return res.status(200).json({ message: 'Unsaved' });
});

module.exports = {
    getAllUsers,
    getMyDetails,
    registerUser,
    updateUser,
    deleteUser,
    getUserById,
    followUser,
    unfollowUser,
    savePost,
    unSavePost,
};
