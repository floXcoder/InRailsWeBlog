'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as SearchActions from '../../../app/assets/javascripts/actions/searchActions';
import * as SearchSelectors from '../../../app/assets/javascripts/selectors/searchSelectors';

describe('Search actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('loadAutocomplete', () => {
        it('should load autocomplete results', () => {
            const articles = FactoryGenerator.create('articles', {number: 3});

            mock('glob:/api/v1/search/autocomplete.json?*', 200, () => ({
                    articles
                })
            );

            return SearchActions.loadAutocomplete({
                selectedTypes: 'article',
                query: 'test',
                limit: 5
            })
                .then((results) => {
                    expect(results.articles).toHaveLength(articles.length);
                });
        });
    });

    describe('fetchAutocomplete', () => {
        it('should fetch autocomplete results', () => {
            const articles = FactoryGenerator.create('articles', {number: 3});
            const tags = FactoryGenerator.create('tags', {number: 3});
            const topics = FactoryGenerator.create('topics', {number: 3});

            mock('glob:/api/v1/search/autocomplete.json?*', 200, () => ({
                    articles,
                    tags,
                    topics
                })
            );

            return dispatch(store, SearchActions.fetchAutocomplete({
                selectedTypes: ['article', 'tag', 'topic'],
                query: 'test',
                limit: 6
            }))
                .then((state) => {
                    expect(SearchSelectors.getAutocompleteArticles(state)).toHaveLength(articles.length);
                    expect(SearchSelectors.getAutocompleteTags(state)).toHaveLength(tags.length);
                    expect(SearchSelectors.getAutocompleteTopics(state)).toHaveLength(topics.length);
                    expect(SearchSelectors.getAutocompleteResults(state)).toHaveLength(articles.length + tags.length + topics.length);
                });
        });
    });

    describe('setSelectedTag', () => {
        it('should set selected tags', () => {
            const tag = FactoryGenerator.create('tags');

            const state = dispatch(store, SearchActions.setSelectedTag(tag));

            expect(SearchSelectors.getSelectedTags(state)).toHaveLength(1);
        });
    });

    describe('fetchSearch', () => {
        it('should fetch search results', () => {
            const articles = FactoryGenerator.create('articles', {number: 3});
            const tags = FactoryGenerator.create('tags', {number: 3});
            const topics = FactoryGenerator.create('topics', {number: 3});

            mock('glob:/api/v1/search.json?*', 200, () => ({
                    articles,
                    tags,
                    topics
                })
            );

            return dispatch(store, SearchActions.fetchSearch({
                selectedTypes: ['article', 'tag', 'topic'],
                query: 'test',
                limit: 6
            }))
                .then((state) => {
                    expect(SearchSelectors.getSearchArticles(state)).toHaveLength(articles.length);
                    expect(SearchSelectors.getSearchTags(state)).toHaveLength(tags.length);
                    expect(SearchSelectors.getSearchTopics(state)).toHaveLength(topics.length);
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
