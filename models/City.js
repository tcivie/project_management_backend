const fs = require('fs');
const countries = require('./Country');
const arePointsClose = require('../middleware/Distance');
const SearchDict = require('./SearchDict');

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

class Cities extends SearchDict {
    constructor() {
        super();
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
            if (!(city.name.toLowerCase() in this.cities)) {
                this.cities[city.name.toLowerCase()] = [];
            }

            this.cities[city.name.toLowerCase()].push(newCity);
            this.citiesIDs[city.id] = newCity;
            this.addToSearchDict(newCity.name);
        });
    }

    search(query) {
        const dataArray = [];
        Cities.getSearchSplits(query).forEach((split) => {
            if (split in this.searchDict) {
                dataArray.push(...this.searchDict[split]);
            }
        });
        const fuse = SearchDict.createFuse(dataArray);
        // Perform a fuzzy search
        const searchResults = fuse.search(query);
        const cities = [];
        searchResults.forEach((results) => {
            if (cities.length < 5) {
                const citiesByName = this.getCityByName(results.item);
                if (citiesByName) cities.push(...citiesByName);
            }
        });
        const ret = [];
        cities.forEach((c) => {
            ret.push(c);
        });
        return ret;
    }

    // @desc    gets a list of cities dicts by name
    getCityByName(cName) {
        const cityName = cName.toLowerCase();
        if (cityName in this.cities) return this.cities[cityName];
        return null;
    }

    // @desc    gets a city dict by ID
    getCityByID(cityID) {
        if (cityID in this.citiesIDs) return this.citiesIDs[cityID];
        return null;
    }

    // @desc    gets a list of cities dicts by country name
    getCitiesByCountryName(cName) {
        const countryName = cName.toLowerCase();
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
