const fs = require('fs');
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

class Countries extends SearchDict {
    constructor() {
        super();
        this.countries = {};
        this.countriesIDs = {};
        this.init();
    }

    async init() {
        const data = await readLocalJSONFile('resources/countries+cities.json');
        data.forEach((country) => {
            const newCountry = {
                name: country.name,
                id: country.id,
                location: [
                    parseFloat(country.longitude),
                    parseFloat(country.latitude),
                ],
                code: country.iso3,
                captial: country.capital,
                region: country.region,
                subRegion: country.subregion,
                currency: country.currency,
                emoji: country.emojiU,
            };
            if (!(country.name.toLowerCase() in this.countries)) {
                this.countries[country.name.toLowerCase()] = [];
            }
            this.countries[country.name.toLowerCase()].push(newCountry);
            this.countriesIDs[country.id] = newCountry;
            this.addToSearchDict(newCountry.name);
        });
    }

    search(query) {
        const dataArray = [];
        SearchDict.getSearchSplits(query).forEach((split) => {
            if (split in this.searchDict) {
                dataArray.push(...this.searchDict[split]);
            }
        });
        const fuse = SearchDict.createFuse(dataArray);
        // Perform a fuzzy search
        const searchResults = fuse.search(query);
        const countries = [];
        searchResults.forEach((results) => {
            if (countries.length < 5) {
                const countriesByName = this.getCountryByName(results.item);
                if (countriesByName) countries.push(...countriesByName);
            }
        });
        const ret = [];
        countries.forEach((c) => {
            ret.push(c);
        });
        return ret;
    }

    // @desc    gets a list of country dicts by name
    getCountryByName(countryName) {
        const cName = countryName.toLowerCase();
        if (cName in this.countries) return this.countries[cName];
        return [];
    }

    // @desc    gets a country dict by ID
    getCountryByID(countryID) {
        if (countryID in this.countriesIDs) return this.countriesIDs[countryID];
        return [];
    }

    // @desc    gets a list of country dicts by region
    getCountriesByRegion(region) {
        return Object.values(this.countriesIDs).filter(
            (value) => value.region === region,
        );
    }
}

module.exports = new Countries();
