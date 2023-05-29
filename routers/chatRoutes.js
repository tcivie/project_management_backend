const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');

router.route('/languages').get(chatController.getLanguages);
router.route('/posts/:cityId').get(chatController.getPosts);
router.route('/posts/:postId').get(chatController.getChatHistory);
router.route('/posts').post(chatController.createPost);
router.route('/posts/:postId').post(chatController.sendMessage);
router.route('/posts/:postId/users').get(chatController.getUsersInChat);

module.exports = router;
