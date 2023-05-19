const express = require('express');

const router = express.Router();

router.use('/sso', require('./ssoRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/search', require('./searchRoutes'));
router.use('/chat', require('./chatRoutes'));

module.exports = router;
