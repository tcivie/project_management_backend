const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const checkActivity = require('../middleware/checkActivity');
const {
    roleList,
    hasAllRoles,
    hasRoles,
    hasNoRoles,
    CanPerfomAction,
} = require('../middleware/checkRoles');

router.use(verifyJWT);

router
    .route('/')
    .get(
        usersController.getAllUsers,
        hasRoles(roleList.superAdmin, roleList.admin),
    )
    .post(usersController.registerUser, hasNoRoles())
    .patch(usersController.updateUser, CanPerfomAction())
    .delete(usersController.deactivateUser, CanPerfomAction());

module.exports = router;
