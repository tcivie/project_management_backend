const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const { roleList, hasRoles } = require('../middleware/checkRoles');

router.use(verifyJWT);

router
  .route('/')
  .get(usersController.getMyDetails)
  .post(usersController.registerUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

router
  .route('/all')
  .get(hasRoles(roleList.superAdmin, roleList.admin), usersController.getAllUsers);

router
  .route('/posts')
  .post(usersController.createPost)
  .get(usersController.getUserPosts);

router
  .route('/comments')
  .post(usersController.createComment)
  .get(usersController.getUserComments);

router.route('/history').get(usersController.getUserHistory);
router.route('/statistics').get(usersController.getUserStatistics);

module.exports = router;
