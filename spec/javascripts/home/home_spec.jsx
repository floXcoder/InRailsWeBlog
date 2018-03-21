'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';

import HomePage from '../../../app/assets/javascripts/components/home/home';

describe('<HomePage />', () => {
    let store;
    let shallowWrapper, mountWrapper;

    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    it('renders home page', () => {
        shallowWrapper = shallow(<HomePage store={store}/>);

        expect(shallowWrapper.find('BrowserRouter')).toHaveLength(1);
        expect(shallowWrapper.find('Switch')).toHaveLength(1);
        expect(shallowWrapper.find('PasteManagerComponent(MatchMediaComponent(MainLayout))')).toBeTruthy();

        expect(shallowWrapper.dive()).toMatchSnapshot();
    });

    afterEach(() => {
        if (mountWrapper) {
            mountWrapper.unmount();
        }
    });
});
