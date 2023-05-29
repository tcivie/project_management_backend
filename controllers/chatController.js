const asyncHandler = require('express-async-handler');
const messages = require('../models/Chat/Messages');
const languages = require('../models/Languages');

// @desc gets supported languages
// @route GET /api/chat/languages
// @access Public
const getLanguages = asyncHandler(async (req, res) => res.status(200).json(languages.get_all()));

// @desc gets chat history
// @route GET /api/chat/post/:postId
// @access Public
const getChatHistory = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    messages.getMessages(postId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc sends a message
// @route POST /api/chat/post/:postId
// @access Public
const sendMessage = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId, content, replyTo } = req.body;
    messages.create({
        postId, userId, content, replyTo,
    })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc get list of users in a chat
// @route GET /api/chat/post/:postId/users
// @access Public
const getUsersInChat = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    messages.getUsers(postId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc creates a post
// @route POST /api/chat/posts
// @access Public
const createPost = asyncHandler(async (req, res) => {
    const {
        language, city, userId, title, content, tags,
    } = req.body;
    messages.create({
        language,
        city,
        userId,
        title,
        content,
        tags,
    })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc gets posts
// @route GET /api/chat/posts/:cityId
// @access Public
const getPosts = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    messages.getPosts(cityId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = {
    getLanguages,
    getChatHistory,
    sendMessage,
    getUsersInChat,
    createPost,
    getPosts,
};
