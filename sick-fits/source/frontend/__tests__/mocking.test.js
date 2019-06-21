function Person(name, foods) {
    this.name = name;
    this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(this.foods)
        }, 2000);
    });
}

describe('mocking learning', () => {
    it.skip('mocks a reg function', () => {
        const fetchDogs = jest.fn();
        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalled();
        expect(fetchDogs).toHaveBeenCalledWith('snickers');
    });

    it.skip('can create a person', () => {
        const me = new Person('Wes', ['pizza', 'burgers']);
        expect(me.name).toBe('Wes');
    });

    it.skip('can fetch foods', async () => {
        const me = new Person('Wes', ['pizza', 'burgers']);
        // mock the fav foods function
        me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi','ramen','pizza']);
        const favFoods = await me.fetchFavFoods();
        expect(favFoods).toContain('pizza');
    });
});