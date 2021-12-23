'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';

import ApplicationLayoutDefault from '../../../app/assets/javascripts/components/layouts/default/application';
// import ScrollBackManager from '../../../app/assets/javascripts/components/modules/scrollBackManager';
// import HeaderLayoutDefault from '../../../app/assets/javascripts/components/layouts/default/header';
// import MainLayoutDefault from '../../../app/assets/javascripts/components/layouts/default/main';
// import FooterLayoutDefault from '../../../app/assets/javascripts/components/layouts/default/footer';

// import theme from '../../../app/assets/jss/theme';

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
        shallowWrapper = shallow(<ApplicationLayoutDefault/>);

        // shallowWrapper.html()
        // shallowWrapper.render()
        // shallowWrapper.text()

        console.log(shallowWrapper)

        expect(shallowWrapper.find('ThemeProvider')).toHaveLength(1);
        expect(shallowWrapper.find('Provider')).toHaveLength(1);
        expect(shallowWrapper.find('BrowserRouter')).toHaveLength(1);
        // expect(shallowWrapper.find('HeaderLayoutDefault')).toHaveLength(1);
        // expect(shallowWrapper.find('MainLayoutDefault')).toHaveLength(1);
        // expect(shallowWrapper.find('FooterLayoutDefault')).toHaveLength(1);

        // expect(shallowWrapper.dive()).toMatchSnapshot();
    });

    afterEach(() => {
        if (mountWrapper) {
            mountWrapper.unmount();
        }
    });
});
