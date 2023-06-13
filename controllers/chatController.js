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
        .then((data) => {
            posts.updateOne({ _id: postId }, { $inc: { comments: 1 } })
                .then(() => res.status(200).json(data));
        })
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
        language, city, title, content, tags,
    } = req.body;
    const postImages = req?.files ? req.files.map((file) => file.path) : [];
    posts.create({
        language,
        city,
        userId: req?.id,
        title,
        content,
        tags,
        postImages,
    })
        .then((data) => {
            const response = {
                post: data._doc,
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

// @desc latest x posts
// @route POST /api/chat/posts/latest/:page/:count/:cityId/:lang
// @access Public
const getLatestPosts = asyncHandler(async (req, res) => {
    const {
        page, count, cityId, lang,
    } = req.params;
    // Page number (starting from 1)
    const pageSize = count; // Number of documents per page
    const skip = (page - 1) * pageSize;// Calculate the number of documents to skip
    let query = {};
    if (cityId) {
        // Include cityId in the search criteria if it is provided
        query = { city: cityId };
    }
    if (lang && lang !== 'all') {
        query = { ...query, language: lang };
    }
    posts.find(query)
        .sort({ createdAt: -1 }) // Sort in descending order based on createdAt field
        .skip(skip) // Skip the specified number of documents
        .limit(pageSize) // Limit the number of documents to retrieve per page
        .then((data) => { res.status(200).json(data); })
        .catch();
});

// @desc gets active users
// @route GET /api/chat/posts/active-users/city/:cityId
// @access Public
const getActiveUsersByCity = asyncHandler(async (req, res) => {
    try {
        let activeUsers = await posts.aggregate([
            { $match: { city: req.params.cityId } },
            { $group: { _id: null, total: { $sum: '$liveUsers' } } },
        ]);
        activeUsers = activeUsers.length > 0 ? activeUsers[0].total : 0;
        res.status(200).json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while retrieving active users.' });
    }
});

// @desc gets active users
// @route GET /api/chat/posts/active-users/city/:cityId/language/:lang
// @access Public
const getActiveUsersByCityLanguage = asyncHandler(async (req, res) => {
    try {
        let activeUsers = await posts.aggregate([
            { $match: { city: req.params.cityId, language: req.params.lang } },
            { $group: { _id: null, total: { $sum: '$liveUsers' } } },
        ]);
        activeUsers = activeUsers.length > 0 ? activeUsers[0].total : 0;
        // console.log(activeUsers);
        res.status(200).json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while retrieving active users.' });
    }
});

// @desc latest x messages
// @route POST /api/chat/comments
// @access Public
const getPostComments = asyncHandler(async (req, res) => {
    const { page, count, postId } = req.params;
    let pageSize = count; // Number of documents per page
    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    const totalCount = await messages.count({ postId });

    if (totalCount < pageSize) {
        pageSize = totalCount;
    }

    messages
        .find({ postId })
        .sort({ createdAt: -1 }) // Sort in descending order based on createdAt field
        .skip(skip) // Skip the specified number of documents
        .limit(pageSize) // Limit the number of documents to retrieve per page
        .then((data) => {
            const reversedData = data.reverse(); // Reverse the order of comments
            res.status(200).json(reversedData);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// @desc get posts with specific languages
// @route GET /api/chat/posts/city/:cityId/:language
// @access Public
const getPostsByLanguage = asyncHandler(async (req, res) => {
    const { cityId, language } = req.params;
    posts.find({ city: cityId, language })
        .sort({ createdAt: -1 })
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

// @desc delete post
// @route DELETE /api/chat/posts/delete/:postId
// @access Private
const deletePost = asyncHandler(async (req, res) => {
    console.log('delete post');
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    const FetchedPost = posts.findOneAndDelete({ _id: postId, userId: req?.id }).exec();
    if (!FetchedPost) {
        return res.status(404).json({ message: 'No Post Found' });
    }
    return res.status(200).json({ message: 'Post Deleted' });
});

// @desc update post
// @route PUT /api/chat/update/:postId
// @access Private
const updatePost = asyncHandler(async (req, res) => {
    console.log('update post');
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const {
        language, city, title, content, tags, existingImages,
    } = req.body;
    console.log('req.files', req.files);
    console.log('req.body', req.body);
    const newImagePaths = req?.files ? req.files.map((file) => file.path) : [];
    const postImages = [...newImagePaths, ...JSON.parse(existingImages || '[]')];

    const updateData = {};
    if (language) updateData.language = language;
    if (city) updateData.city = city;
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags && tags.length > 0) updateData.tags = tags;
    updateData.postImages = postImages;
    console.log('UpdateData', updateData);
    const updatedPost = await posts.findOneAndUpdate(
        { _id: postId, userId: req?.id },
        updateData,
        { new: true },
    ).exec();

    if (!updatedPost) {
        return res.status(404).json({ message: 'No Post Found' });
    }

    return res.status(200).json({ message: 'Post Updated' });
});

const getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    posts.findOne({ _id: postId })
        .then((data) => {
            const response = {
                post: data._doc,
                owner: data?.userId ? data.userId.equals(req?.id) : false,
                setHelpful: data.helpful ? data.helpful.includes(req?.id) : false,
                setSaved: data.saves ? data.saves.includes(req?.id) : false,
            };
            res.status(200).json(response);
        })
        .catch((err) => res.status(500).json({ error: err }));
});

// @desc user joined the chat
// @route POST /api/posts/post/joinChat/:postId
// @access Private
const joinChat = asyncHandler(async (req, res) => {
    // console.log('join chat');
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    posts.findOneAndUpdate({ _id: postId }, { $addToSet: { liveUsers: req?.id } })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// @desc user left the chat
// @route POST /api/posts/post/leaveChat/:postId
// @access Private
const leaveChat = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    posts.findOneAndUpdate({ _id: postId }, { $pull: { liveUsers: req?.id } })
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
    deletePost,
    updatePost,
    getPost,
    getLatestPosts,
    getPostComments,
    getActiveUsersByCity,
    getActiveUsersByCityLanguage,
    joinChat,
    leaveChat,
};
