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
    .route('/:id')
    .get(usersController.getUserById);
router.use(verifyJWT);

router
    .route('/')
    .get(CanPerfomAction(), usersController.getMyDetails)
    .post(hasNoRoles(), upload, usersController.registerUser)
    .patch(CanPerfomAction(), upload, usersController.updateUser)
    .delete(CanPerfomAction(), usersController.deleteUser);

router
    .route('/all')
    .get(
        hasRoles(roleList.superAdmin, roleList.admin),
        usersController.getAllUsers,
    );

module.exports = router;
