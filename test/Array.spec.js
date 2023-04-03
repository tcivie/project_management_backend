import { describe, it } from 'mocha';
import { assert } from 'chai';

describe('Basic Array Test', () => {
    it('should return -1 when the value is not present', () => {
        // eslint-disable-next-line no-undef
        assert.equal(-1, [1, 2, 3].indexOf(4));
    });
});
