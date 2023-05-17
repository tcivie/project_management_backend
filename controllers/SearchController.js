const asyncHandler = require('express-async-handler');
const cities = require('../models/City');
const countries = require('../models/Country');

// @desc searches countries and cities based on query
// @route POST /api/search/query
// @access Public

function dictCopy(ogDict) {
    return JSON.parse(JSON.stringify(ogDict));
}
const searchQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(403).json({ error: 'Missing query.' });
    if (query.length < 3) {
        return res.status(403).json({ error: 'Query too short' });
    }
    const cityRes = cities.search(query);
    const countryRes = countries.search(query);
    if (!cityRes && !countryRes) {
        return res.status(404).json({ message: 'No results found.' });
    }
    let cityCountries = new Set(countryRes);
    // const searched = new Set();
    cityRes.forEach((city) => {
        const countriesByName = countries.getCountryByName(city.country);
        countriesByName.forEach((country) => {
            cityCountries.add(country);
        });
    });
    cityCountries = [...cityCountries];
    for (let i = 0; i < cityCountries.length; i++) {
        cityCountries[i] = dictCopy(cityCountries[i]);
        cityCountries[i].cities = [];
        cityRes.forEach((city) => {
            if (city.country === cityCountries[i].name) {
                cityCountries[i].cities.push(city);
            }
        });
        if (cityCountries[i].cities.length === 0) {
            delete cityCountries[i].cities;
        }
    }
    return res.status(200).json(cityCountries);
});

// @desc searches cities in a radius
// @route POST /api/search/nearPoint
// @access Public
const searchNear = asyncHandler(async (req, res) => {
    const { point, radius } = req.body;
    // point: [lat,lon]
    if (!point || !radius) {
        return res
            .status(403)
            .json({ error: 'Invalid rquest, insuficient arguments.' });
    }
    const cityRes = cities.getCitiesCloseToLocation(point, radius);
    return res.status(200).json(cityRes);
});

module.exports = {
    searchQuery,
    searchNear,
};
