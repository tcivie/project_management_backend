const express = require('express');
const router = express.Router();
const ssoController = require('../controllers/ssoController');

router.route('/google').post(ssoController.googleSignIn);

module.exports = router;
