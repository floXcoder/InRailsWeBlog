'use strict';

import '../test_helper';

import TagSidebar from '../../../app/assets/javascripts/components/tags/sidebar';

describe('<TagSidebar />', () => {
    let shallowWrapper, mountWrapper, renderWrapper;

    beforeAll(() => {
        initSession({
            tags: [
                {
                    id: 1,
                    name: 'test'
                }
            ]
        });
    });

    afterAll(() => {
        resetSession();
    });

    beforeEach(() => {
        // initSession();
        // shallowWrapper = shallow(<TagSidebar />);
        mountWrapper = mount(<TagSidebar />);
        // renderWrapper = render(<TagSidebar />);

        // spyOn(Reflux, 'mapStoreToState').and.returnValue({tags: []});
        // spyOn(React.Component, "mapStoreToState").and.callFake(function(store, cb) {
        //     log.error(store)
        //     log.error(cb)
        //     return 1001;
        // });
    });

    afterEach(() => {
        // mountWrapper.unmount();
        // resetSession();
    });

    it('renders a list of tags by default', () => {
        // expect(checkbox.text()).toEqual('Off');
        // checkbox.find('input').simulate('change');
        // expect(checkbox.text()).toEqual('On');

        expect(Utils.getJSON.mock.calls.length).toEqual(2);

    });

    // it('renders tags with relationships in correct order', () => {
    //     const component = renderer.create(
    //         <TagSidebar />
    //     );
    //
    // expect(toJson(wrapper)).toMatchSnapshot();
    //
    //     let tree = component.toJSON();
    //     expect(tree).toMatchSnapshot();
    //
    //     // // manually trigger the callback
    //     // tree.props.onMouseEnter();
    //     // // re-rendering
    //     // tree = component.toJSON();
    //     // expect(tree).toMatchSnapshot();
    // });
});
