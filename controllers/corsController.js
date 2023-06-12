const asyncHandler = require('express-async-handler');
const ogs = require('open-graph-scraper');
const AbortController = require('abort-controller');

global.AbortController = AbortController;

// @desc gets Open Graph Data for give WikiId
// @route GET /api/cors/wiki
// @access Public
const getWiki = asyncHandler(async (req, res) => {
    const { wikiId } = req.query;
    const url = `https://www.wikidata.org/wiki/${wikiId}`;
    const options = { url };
    ogs(options)
        .then((data) => res.status(200).json(data))
        .catch((error) => {
            console.log('error:', error);
            res.status(404);
        });
});

module.exports = {
    getWiki,
};
