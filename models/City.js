const fs = require('fs');
const countries = require('./Country');
const arePointsClose = require('../middleware/Distance');

async function readLocalJSONFile(filePath) {
    try {
        const fileData = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        return jsonData;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw error;
    }
}

class Cities {
    constructor() {
        this.cities = {};
        this.citiesIDs = {};
        this.init();
    }

    async init() {
        const data = await readLocalJSONFile('resources/cities.json');
        data.forEach((city) => {
            const newCity = {
                name: city.name,
                id: city.id,
                location: [
                    parseFloat(city.longitude),
                    parseFloat(city.latitude),
                ],
                country: city.country_name,
                stateName: city.state_name,
            };
            if (!(city.name in this.cities)) this.cities[city.name] = [];

            this.cities[city.name].push(newCity);
            this.citiesIDs[city.id] = newCity;
        });
    }

    // @desc    gets a list of cities dicts by name
    getCityByName(cityName) {
        if (cityName in this.cities) return this.cities[cityName];
        return null;
    }

    // @desc    gets a city dict by ID
    getCityByID(cityID) {
        if (cityID in this.citiesIDs) return this.citiesIDs[cityID];
        return null;
    }

    // @desc    gets a list of cities dicts by country name
    getCitiesByCountryName(countryName) {
        return Object.values(this.citiesIDs).filter(
            (value) => value.country === countryName,
        );
    }

    // @desc    gets a list of cities dicts by country ID
    getCitiesByCountryID(countryID) {
        const country = countries.getCountryByID(countryID);
        return this.getCitiesByCountryName(country?.name);
    }

    getCitiesCloseToPoint(latitude, longitude, distance) {
        return Object.values(this.citiesIDs).filter((value) =>
            arePointsClose(
                latitude,
                longitude,
                value.location[1],
                value.location[0],
                distance,
            ),
        );
    }

    getCitiesCloseToLocation(location, distance) {
        return this.getCitiesCloseToPoint(location[1], location[0], distance);
    }

    count() {
        return Object.keys(this.cities).length;
    }
}

module.exports = new Cities();
