const express = require('express');

const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const { upload } = require('../utils/imageUploader');

const {
    roleList,
    // hasAllRoles,
    hasRoles,
    hasNoRoles,
    CanPerfomAction,
} = require('../middleware/checkRoles');

router
    .use(verifyJWT)
    .route('/all')
    .get(
        hasRoles(roleList.superAdmin, roleList.admin),
        usersController.getAllUsers,
    );

router
    .use(verifyJWT)
    .route('/follow')
    .post(usersController.followUser);

router
    .use(verifyJWT)
    .route('/unfollow')
    .post(usersController.unfollowUser);

router
    .use(verifyJWT)
    .route('/savePost')
    .post(usersController.savePost);

router
    .use(verifyJWT)
    .route('/unSavePost')
    .post(usersController.unSavePost);

router
    .route('/:id')
    .get(usersController.getUserById);

router
    .use(verifyJWT)
    .route('/')
    .get(CanPerfomAction(), usersController.getMyDetails)
    .post(hasNoRoles(), upload, usersController.registerUser)
    .patch(CanPerfomAction(), upload, usersController.updateUser)
    .delete(CanPerfomAction(), usersController.deleteUser);

module.exports = router;
