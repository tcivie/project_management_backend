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
    .get(CanPerfomAction(), usersController.getMyDetails)
    .post(hasNoRoles(), usersController.registerUser)
    .patch(CanPerfomAction(), usersController.updateUser)
    .delete(CanPerfomAction(), usersController.deleteUser);

router
    .route('/all')
    .get(
        hasRoles(roleList.superAdmin, roleList.admin),
        usersController.getAllUsers,
    );

module.exports = router;
