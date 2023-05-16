const fs = require('fs');

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

class Countries {
    constructor() {
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
            };
            if (!(country.name in this.countries)) {
                this.countries[country.name] = [];
            }
            this.countries[country.name].push(newCountry);
            this.countriesIDs[country.id] = newCountry;
        });
    }

    // @desc    gets a list of country dicts by name
    getCountryByName(countryName) {
        if (countryName in this.countries) return this.countries[countryName];
        return null;
    }

    // @desc    gets a country dict by ID
    getCountryByID(countryID) {
        if (countryID in this.countriesIDs) return this.countriesIDs[countryID];
        return null;
    }

    // @desc    gets a list of country dicts by region
    getCountriesByRegion(region) {
        return Object.values(this.countriesIDs).filter(
            (value) => value.region === region,
        );
    }
}

module.exports = new Countries();
