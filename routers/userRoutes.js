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
        hasRoles(roleList.superAdmin, roleList.admin),
        usersController.getAllUsers,
    )
    .post(hasNoRoles(), usersController.registerUser)
    .patch(CanPerfomAction(), usersController.updateUser)
    .delete(CanPerfomAction(), usersController.deleteUser);

module.exports = router;
