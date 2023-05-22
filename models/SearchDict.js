const Fuse = require('fuse.js');

const options = {
    shouldSort: true, // Enable sorting of search results
    includeMatches: false, // Include matched characters in the search results
    includeScore: true, // Include search scores in the search results
    threshold: 0.3, // Set the match threshold to 0.4
    location: 0, // Match at the start of the string
    distance: 100, // Use the 'simple' distance algorithm
    minMatchCharLength: 1, // Require at least 1 character to match
};

class SearchDict {
    constructor() {
        this.searchDict = {};
    }

    static createFuse(dataArray) {
        return new Fuse([...new Set(dataArray)], options);
    }

    // eslint-disable-next-line no-unused-vars
    search(query) {
        throw new Error(
            'Abstract function must be implemented in derived class',
        );
    }

    addSearchToDict(letters, str) {
        if (letters in this.searchDict) {
            if (!(str in this.searchDict[letters])) {
                this.searchDict[letters].push(str);
            }
        } else {
            this.searchDict[letters] = [str];
        }
    }

    static getSearchSplits(str) {
        const ret = [];
        const splits = str.toLowerCase().split(' ');
        splits.forEach((split) => {
            for (let i = 0; i < split.length - 1; i++) {
                const substring = split.substring(i, i + 2);
                ret.push(substring);
            }
        });
        return ret;
    }

    addToSearchDict(str) {
        const lStr = str.toLowerCase();
        SearchDict.getSearchSplits(str).forEach((substring) => {
            this.addSearchToDict(substring, lStr);
        });
    }
}

module.exports = SearchDict;
