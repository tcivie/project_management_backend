const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');
const { uploadMultiple } = require('../utils/imageUploader');
const verifyJWT = require('../middleware/verifyJWT');
const checkActive = require('../middleware/checkActivity');

router.route('/languages').get(chatController.getLanguages);
router.route('/posts/post/:postId/users').get(chatController.getUsersInChat);
router.route('/posts/post/:postId').get(chatController.getChatHistory);
router.use(verifyJWT);
router.route('/posts/city/:cityId/:language').get(chatController.getPostsByLanguage);
router.route('/posts/city/:cityId').get(chatController.getPosts);
router.use(checkActive);
router.route('/posts/post/setHelpful').post(chatController.setHelpful);
router.route('/posts/post/unsetHelpful').post(chatController.unsetHelpful);
router.route('/posts/post/:postId').post(chatController.sendMessage);
router.route('/posts').post(uploadMultiple, chatController.createPost);

module.exports = router;
