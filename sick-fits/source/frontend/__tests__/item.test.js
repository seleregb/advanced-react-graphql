import ItemComponent from '../components/Item';
import { shallow} from 'enzyme';

const fakeItem = {
    id: 'ABC123',
    title: 'A Cool Item',
    price: 5000,
    description: 'This item is really cool!',
    image: 'dog.jpg',
    largeImage: 'largedog.jpg',
};

describe('<Item/>',() => {
    it('renders the price and title properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        const priceTag = wrapper.find('PriceTag');
        expect(priceTag.dive().text()).toEqual('$50');
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
        // console.log(wrapper.debug());
    });

    it('renders the image properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        const image = wrapper.find('img');
        expect(image.props().src).toBe(fakeItem.image);
        expect(image.props().alt).toBe(fakeItem.title);
    });

    it('renders out the buttons properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        const buttonList = wrapper.find('.buttonList');
        expect(buttonList.children()).toHaveLength(3);
        expect(buttonList.find('Link').exists()).toBeTruthy();
        expect(buttonList.find('AddToCart').exists()).toBeTruthy();
        expect(buttonList.find('DeleteItem').exists()).toBeTruthy();
    });
})