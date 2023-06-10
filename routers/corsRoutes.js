const express = require('express');

const router = express.Router();
const corsController = require('../controllers/corsController');

router.route('/wiki').get(corsController.getWiki);

module.exports = router;
