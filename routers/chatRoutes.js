const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');
const { uploadMultiple, deleteExistingImages } = require('../utils/imageUploader');
const verifyJWT = require('../middleware/verifyJWT');
const checkActive = require('../middleware/checkActivity');
const { CanPerfomAction } = require('../middleware/checkRoles');

router.route('/languages').get(chatController.getLanguages);
router.route('/posts/post/:postId/users').get(chatController.getUsersInChat);
router.route('/posts/post/:postId').get(chatController.getChatHistory);
router.route('/posts/post/getSinglePost/:postId').get(chatController.getPost);
router.route('/posts/latest/:page/:count/:cityId/:lang').get(chatController.getLatestPosts);
router.route('/posts/comments/:postId/:page/:count').get(chatController.getPostComments);
router.route('/posts/active-users/city/:cityId/:lang').get(chatController.getActiveUsersByCityLanguage);
router.route('/posts/active-users/city/:cityId').get(chatController.getActiveUsersByCity);
router.use(verifyJWT);
router.route('/posts/city/:cityId/:language').get(chatController.getPostsByLanguage);
router.route('/posts/city/:cityId').get(chatController.getPosts);
router.use(checkActive);
router.route('/posts/post/setHelpful').post(chatController.setHelpful);
router.route('/posts/post/unsetHelpful').post(chatController.unsetHelpful);
router.route('/posts/post/joinChat/:postId').post(chatController.joinChat);
router.route('/posts/post/leaveChat/:postId').post(chatController.leaveChat);
router.route('/posts/post/:postId').post(chatController.sendMessage);
router.route('/posts').post(uploadMultiple, chatController.createPost);
router.use(CanPerfomAction());
router.route('/posts/delete/:postId').delete(chatController.deletePost);
router.route('/posts/update/:postId').patch(uploadMultiple, deleteExistingImages, chatController.updatePost);

module.exports = router;
