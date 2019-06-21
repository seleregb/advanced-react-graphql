import formatMoney from '../lib/formatMoney';

describe('formatMoney fn', () => {
    it.skip('works with fractional dollars', () => {
        expect(formatMoney(1)).toEqual('CA$0.01');
        expect(formatMoney(10)).toEqual('CA$0.10');
        expect(formatMoney(9)).toEqual('CA$0.09');
        expect(formatMoney(40)).toEqual('CA$0.40');
    });

    it.skip('leaves cents off for whole dollars', () => {
        expect(formatMoney(5000)).toEqual('CA$50');
        expect(formatMoney(100)).toEqual('CA$1');
        expect(formatMoney(500000)).toEqual('CA$5,000');
    });

    it.skip('works with whole and fractional dollars', () => {
        expect(formatMoney(5012)).toEqual('CA$50.12');
        expect(formatMoney(110)).toEqual('CA$1.10');
    });
});