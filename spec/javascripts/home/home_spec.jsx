'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';

import ApplicationLayoutHome from '../../../app/assets/javascripts/components/layouts/home/application';
// import ScrollBackManager from "../../../app/assets/javascripts/components/modules/scrollBackManager";
// import HeaderLayoutHome from "../../../app/assets/javascripts/components/layouts/home/header";
// import MainLayoutHome from "../../../app/assets/javascripts/components/layouts/home/main";
// import FooterLayoutHome from "../../../app/assets/javascripts/components/layouts/home/footer";

// import theme from "../../../app/assets/jss/theme";

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
        shallowWrapper = shallow(<ApplicationLayoutHome/>);

        // console.log(shallowWrapper.html())
        // console.log(shallowWrapper.render())
        // console.log(shallowWrapper.text())

        expect(shallowWrapper.find('ThemeProvider')).toHaveLength(1);
        expect(shallowWrapper.find('BrowserRouter')).toHaveLength(1);
        expect(shallowWrapper.find('Provider')).toHaveLength(1);
        // expect(shallowWrapper.find('HeaderLayoutHome')).toHaveLength(1);
        // expect(shallowWrapper.find('MainLayoutHome')).toHaveLength(1);
        // expect(shallowWrapper.find('FooterLayoutHome')).toHaveLength(1);

        // expect(shallowWrapper.dive()).toMatchSnapshot();
    });

    afterEach(() => {
        if (mountWrapper) {
            mountWrapper.unmount();
        }
    });
});
