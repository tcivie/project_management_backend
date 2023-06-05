const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const posts = require('../models/Chat/Posts');
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
// @access Private
const createPost = asyncHandler(async (req, res) => {
    const {
        language, city, userId, title, content, tags,
    } = req.body;
    const postImages = req?.files ? req.files.map((file) => file.path) : [];
    posts.create({
        language,
        city,
        userId,
        title,
        content,
        tags,
        postImages,
    })
        .then((data) => {
            const response = {
                data: data._doc,
                owner: data?.userId ? data.userId.equals(req?.id) : false,
                setHelpful: data.helpful ? data.helpful.includes(req?.id) : false,
                setSaved: data.saves ? data.saves.includes(req?.id) : false,
            };
            res.status(200).json(response);
        })
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc gets posts
// @route GET /api/chat/posts/city/:cityId
// @access Public
const getPosts = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    posts.find({ city: cityId })
        .then((data) => {
            const response = data.map((post) => ({
                post: post._doc,
                owner: post?.userId ? post.userId.equals(req?.id) : false,
                setHelpful: post.helpful ? post.helpful.includes(req?.id) : false,
                setSaved: post.saves ? post.saves.includes(req?.id) : false,
            }));
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// @desc get posts with specific languages
// @route GET /api/chat/posts/city/:cityId/:language
// @access Public
const getPostsByLanguage = asyncHandler(async (req, res) => {
    const { cityId, language } = req.params;
    posts.find({ city: cityId, language })
        .then((data) => {
            const response = data.map((post) => ({
                post: post._doc,
                owner: post?.userId ? post.userId.equals(req?.id) : false,
                setHelpful: post.helpful ? post.helpful.includes(req?.id) : false,
                setSaved: post.saves ? post.saves.includes(req?.id) : false,
            }));
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// @desc set post as helpful
// @route POST /api/chat/posts/setHelpful
// @access Private
const setHelpful = asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    posts.findOneAndUpdate({ _id: postId }, { $addToSet: { helpful: userId } })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// @desc unset post as helpful
// @route POST /api/chat/posts/unsetHelpful
// @access Private
const unsetHelpful = asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    posts.findOneAndUpdate({ _id: postId }, { $pull: { helpful: userId } }, { new: true }).exec()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = {
    getLanguages,
    getChatHistory,
    sendMessage,
    getUsersInChat,
    createPost,
    getPosts,
    getPostsByLanguage,
    setHelpful,
    unsetHelpful,
};
