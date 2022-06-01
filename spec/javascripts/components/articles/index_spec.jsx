'use strict';

import '../../test_helper';

import reducers from '../../../../app/assets/javascripts/reducers';

// import ArticleIndex from '../../../../app/assets/javascripts/components/articles';

describe('<ArticleIndex />', () => {
    let store;
    // let shallowWrapper;
    let mountWrapper;

    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    it('renders article index', () => {
        const articles = FactoryGenerator.create('articles', {number: 3});

        mock('/api/v1/articles', 200, () => ({
                articles: articles,
                meta: {
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalCount: 3
                    }
                }
            })
        );

        // shallowWrapper = shallow(<ArticleIndex store={store}
        //                                        params={{}}/>);
        //
        // expect(shallowWrapper.dive()).toMatchSnapshot();
    });

    afterEach(() => {
        if (mountWrapper) {
            mountWrapper.unmount();
        }
    });
});
