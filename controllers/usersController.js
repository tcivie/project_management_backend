const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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

// @desc    Get logged user details
// @route   GET /api/users
// @access  Private/Admin
const getMyDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.user }).select('-password').populate('posts comments').lean().exec();
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  res.status(200).json(user);
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
  const hashedPwd = isSSO ? await bcrypt.hash(randomPassword, 10) : await bcrypt.hash(password, 10);

  // Create and store new user
  const user = await User.create({
    username,
    email,
    password: hashedPwd,
    roles: 1,
    nickname: nickname || username,
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
  const user = await User.findOne({ username }).exec();
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
  return res.status(200).json(reply);
});

// @desc    Create a post
// @route   POST /api/users/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user._id;

  const post = await Post.create({
    title,
    content,
    author: userId,
  });

  // Add the created post to the user's posts array and upload history
  const user = await User.findById(userId);
  user.posts.push(post._id);
  user.uploadHistory.push(post._id);
  await user.save();

  res.status(201).json({ message: 'Post created', post });
});

// @desc    Get all posts by user
// @route   GET /api/users/posts
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate('posts');
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  res.status(200).json(user.posts);
});

// @desc    Create a comment
// @route   POST /api/users/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text, postId } = req.body;
  const userId = req.user._id;

  const comment = await Comment.create({
    text,
    author: userId,
    post: postId,
  });

  // Add the created comment to the user's comments array
  const user = await User.findById(userId);
  user.comments.push(comment._id);
  await user.save();

  res.status(201).json({ message: 'Comment created', comment });
});

// @desc    Get all comments by user
// @route   GET /api/users/comments
// @access  Private
const getUserComments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate('comments');
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  res.status(200).json(user.comments);
});

// @desc    Get user search and upload history
// @route   GET /api/users/history
// @access  Private
const getUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select('searchHistory uploadHistory')
    .populate('uploadHistory')
    .lean();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  res.status(200).json({ searchHistory: user.searchHistory, uploadHistory: user.uploadHistory });
});

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
const getUserStatistics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Retrieve and calculate user statistics
  // Example: Total posts, comments, search history count, etc.
  const userStatistics = {
    totalPosts: await Post.countDocuments({ author: userId }),
    totalComments: await Comment.countDocuments({ author: userId }),
    // Add more statistics as needed
  };

  res.status(200).json(userStatistics);
});

module.exports = {
  getAllUsers,
  getMyDetails,
  registerUser,
  updateUser,
  deleteUser,
  createPost,
  getUserPosts,
  createComment,
  getUserComments,
  getUserHistory,
  getUserStatistics,
};
