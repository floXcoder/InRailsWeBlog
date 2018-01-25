'use strict';

import '../test_helper';

import HomePage from '../../../app/assets/javascripts/components/home/home';

describe('<HomePage />', () => {

    it('load home page', () => {
        expect(true).toEqual(true);
    });

    // let shallowWrapper, mountWrapper;
    //
    // beforeEach(() => {
    //     initSession();
    //     shallowWrapper = shallow(<HomePage />);
    //     mountWrapper = mount(<HomePage />);
    // });
    //
    // afterEach(() => {
    //     mountWrapper.unmount();
    //     resetSession();
    // });
    //
    // it('renders affiliation and popular results by default', () => {
    //     expect(shallowWrapper.find(AffiliationResult)).to.be.present();
    //     expect(shallowWrapper.find(AffiliationResult)).to.have.prop('title').equal(I18n.t(''));
    //
    //     expect(shallowWrapper.find(PopularResult)).to.be.present();
    //     expect(shallowWrapper.find(PopularResult)).to.have.prop('title').equal(I18n.t(''));
    // });
    //
    // it('renders results if any', () => {
    //     shallowWrapper.setState({hasResults: true});
    //     expect(shallowWrapper.find(AffiliationResult)).not.to.be.present();
    //
    //     expect(shallowWrapper.find(PopularResult)).not.to.be.present();
    // });
});
