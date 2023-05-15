const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers, verifyJWT)
    .post(usersController.registerUser)
    .patch(usersController.updateUser, verifyJWT)
    .delete(usersController.deleteUser, verifyJWT)

module.exports = router
