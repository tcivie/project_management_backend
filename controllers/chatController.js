const asyncHandler = require('express-async-handler');

const languages = require('../models/Languages');

// @desc gets supported languages
// @route GET /api/chat/languages
// @access Public

const getLanguages = asyncHandler(async (req, res) => res.status(200).json(languages.get_all()));

module.exports = {
    getLanguages,
};
