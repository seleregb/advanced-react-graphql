describe('sample test 101', () => {
    it.skip('works as expected', () => {
        expect(1).toEqual(1);
    });

    it.skip('handles ranges just fine', () => {
        const age = 200;
        expect(age).toBeGreaterThan(100);
    });
});