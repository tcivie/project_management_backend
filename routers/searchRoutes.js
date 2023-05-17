const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

router.route('/query').post(searchController.searchQuery);

module.exports = router;
