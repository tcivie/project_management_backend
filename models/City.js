const fs = require('fs');
const Fuse = require('fuse.js');
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

const options = {
    shouldSort: true, // Enable sorting of search results
    includeMatches: false, // Include matched characters in the search results
    includeScore: true, // Include search scores in the search results
    threshold: 0.3, // Set the match threshold to 0.4
    location: 0, // Match at the start of the string
    distance: 100, // Use the 'simple' distance algorithm
    minMatchCharLength: 1, // Require at least 1 character to match
};

class Cities {
    constructor() {
        this.cities = {};
        this.citiesIDs = {};
        this.searchDict = {};
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
            this.addToSearchDict(newCity);
        });
    }

    search(query) {
        const dataArray = [];
        Cities.getCitySearchSplits(query).forEach((split) => {
            if (split in this.searchDict) {
                dataArray.push(...this.searchDict[split]);
            }
        });
        const fuse = new Fuse([...new Set(dataArray)], options);
        // Perform a fuzzy search
        const searchResults = fuse.search(query);
        const cities = [];
        if (searchResults[0].score === 0) {
            cities.push(...this.getCityByName(searchResults[0].item));
        } else {
            searchResults.forEach((results) => {
                if (cities.length < 5) {
                    cities.push(...this.getCityByName(results.item));
                }
            });
        }
        const ret = [];
        cities.forEach((c) => {
            ret.push({
                city: c.name,
                country: `${c.country} - ${c.stateName}`,
            });
        });
        return ret;
    }

    addSearchToDict(letters, cityName) {
        if (letters in this.searchDict) {
            if (!(cityName in this.searchDict[letters])) {
                this.searchDict[letters].push(cityName);
            }
        } else {
            this.searchDict[letters] = [cityName];
        }
    }

    static getCitySearchSplits(cityName) {
        const ret = [];
        const splits = cityName.toLowerCase().split(' ');
        splits.forEach((split) => {
            for (let i = 0; i < split.length - 1; i++) {
                const substring = split.substring(i, i + 2);
                ret.push(substring);
            }
        });
        return ret;
    }

    addToSearchDict(city) {
        const cName = city.name.toLowerCase();
        Cities.getCitySearchSplits(city.name).forEach((substring) => {
            this.addSearchToDict(substring, cName);
        });
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
