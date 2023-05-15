// import { describe, it } from 'mocha';
// import { assert } from 'chai';

const { describe, it } = require('mocha');
const { assert } = require('chai');

describe('Basic Array Test', () => {
    it('should return -1 when the value is not present', () => {
        // eslint-disable-next-line no-undef
        assert.equal(-1, [1, 2, 3].indexOf(4));
    });
});
