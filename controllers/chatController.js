const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
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
    console.log('getChatHistory');
    const { postId } = req.params;
    messages.getMessages(postId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc sends a message
// @route POST /api/chat/post/:postId
// @access Public
const sendMessage = asyncHandler(async (req, res) => {
    console.log('sendMessage');
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
    console.log('getUsersInChat');
    const { postId } = req.params;
    messages.getUsers(postId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc creates a post
// @route POST /api/chat/posts
// @access Public
const createPost = asyncHandler(async (req, res) => {
    console.log('createPost');
    const {
        language, city, userId, title, content, tags,
    } = req.body;
    const postImage = req.file.path;
    messages.create({
        language,
        city,
        userId,
        title,
        content,
        tags,
        postImage,
    })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc gets posts
// @route GET /api/chat/posts/city/:cityId
// @access Public
const getPosts = asyncHandler(async (req, res) => {
    console.log('getPosts');
    const { cityId } = req.params;
    messages.find({ city: cityId })
        .then((data) => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc get posts with specific languages
// @route GET /api/chat/posts/city/:cityId/:language
// @access Public
const getPostsByLanguage = asyncHandler(async (req, res) => {
    console.log('getPostsByLanguage');
    const { cityId, language } = req.params;
    messages.find({ city: cityId, language })
        .then((data) => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = {
    getLanguages,
    getChatHistory,
    sendMessage,
    getUsersInChat,
    createPost,
    getPosts,
    getPostsByLanguage,
};
