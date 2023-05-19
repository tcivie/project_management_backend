const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');

router.route('/languages').get(chatController.getLanguages);

module.exports = router;
