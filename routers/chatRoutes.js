const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');
const { uploadMultiple } = require('../utils/imageUploader');

router.route('/languages').get(chatController.getLanguages);
router.route('/posts/city/:cityId/:language').get(chatController.getPostsByLanguage);
router.route('/posts/city/:cityId').get(chatController.getPosts);
router.route('/posts/post/:postId/users').get(chatController.getUsersInChat);
router.route('/posts/post/:postId').get(chatController.getChatHistory);
router.route('/posts/post/:postId').post(chatController.sendMessage);
router.route('/posts').post(uploadMultiple, chatController.createPost);

module.exports = router;
