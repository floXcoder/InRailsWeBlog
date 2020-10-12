'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as TagActions from '../../../app/assets/javascripts/actions/tagActions';
import * as TagSelectors from '../../../app/assets/javascripts/selectors/tagSelectors';

describe('Tags actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('fetchTags', () => {
        it('should fetch all tags', () => {
            const publicTags = FactoryGenerator.create('tags', {number: 3});
            const privateTags = FactoryGenerator.create('tags', {number: 3, visibility: 'only_me'});

            mock('/api/v1/tags.json?locale=en', 200, () => ({
                    tags: publicTags.concat(privateTags)
                })
            );

            return dispatch(store, TagActions.fetchTags())
                .then((state) => {
                    expect(state.tagState.tags).toHaveLength(publicTags.length + privateTags.length);
                    expect(TagSelectors.getPublicTags(state)).toHaveLength(publicTags.length);
                    expect(TagSelectors.getPrivateTags(state)).toHaveLength(privateTags.length);
                    expect(state.tagState.tags.first().id).toEqual(1);
                    expect(TagSelectors.getCategorizedTags(state, 'everyone')).toHaveLength(1);
                    expect(TagSelectors.getCategorizedTags(state, 'everyone').first().id).toEqual('everyone');
                    expect(TagSelectors.getCategorizedTags(state, 'only_me')).toHaveLength(1);
                    expect(TagSelectors.getCategorizedTags(state, 'only_me').first().id).toEqual('only_me');
                });
        });
    });

    describe('fetchTag', () => {
        it('should fetch one tag', () => {
            const tag = FactoryGenerator.create('tags');

            mock(`/api/v1/tags/${tag.id}.json?locale=en`, 200, () => ({
                    tag: tag
                })
            );

            return dispatch(store, TagActions.fetchTag(tag.id))
                .then((state) => {
                    expect(state.tagState.tag.id).toEqual(tag.id);
                    expect(state.tagState.tag.name).toEqual(tag.name);
                });
        });
    });

    describe('filterTags', () => {
        it('should filter tags', () => {
            const tags = FactoryGenerator.create('tags', {number: 5, parentIds: [], childIds: []});
            const filterText = tags.first().name;

            mock('/api/v1/tags.json?locale=en', 200, () => ({
                    tags: tags
                })
            );

            dispatch(store, TagActions.filterTags(filterText));

            return dispatch(store, TagActions.fetchTags())
                .then((state) => {
                    expect(state.tagState.filterText).toEqual(filterText);
                });
        });
    });

    describe('addTag', () => {
        it('should create a tag', () => {
            const newTag = FactoryGenerator.create('tags');

            mock('/api/v1/tags.json', 200, (request) => ({
                    tag: request.tag
                })
            );

            return dispatch(store, TagActions.addTag(newTag))
                .then((state) => {
                    expect(state.tagState.tag.name).toEqual(newTag.name);
                    expect(state.tagState.tag.user.id).toEqual(newTag.user.id);
                    expect(TagSelectors.getTagErrors(state)).toEqual(undefined);
                });
        });

        it('should not create a tag with errors', () => {
            const newTag = FactoryGenerator.create('tags');
            const contentError = 'too short';

            mock('/api/v1/tags.json', 422, (request) => ({
                    errors: {content: [contentError]}
                })
            );

            return dispatch(store, TagActions.addTag(newTag))
                .then((state) => {
                    expect(state.tagState.tag).toBeUndefined();
                });
        });
    });

    describe('updateTag', () => {
        it('should update a tag', () => {
            const tag = FactoryGenerator.create('tags');
            const updateParameters = {name: 'Updated tag name'};

            mock(`/api/v1/tags/${tag.id}.json`, 200, (request) => ({
                    tag: {...tag, ...request.tag}
                })
            );

            return dispatch(store, TagActions.updateTag({id: tag.id, ...updateParameters}))
                .then((state) => {
                    expect(state.tagState.tag.name).toEqual(updateParameters.name);
                    expect(TagSelectors.getTagErrors(state)).toEqual(undefined);
                });
        });
    });

    describe('deleteTag', () => {
        it('should delete a tag', () => {
            const tag = FactoryGenerator.create('tags');

            mock(`/api/v1/tags/${tag.id}.json`, 204);

            return dispatch(store, TagActions.deleteTag(tag.id))
                .then((state) => {
                    expect(state.tagState.tag).toBeUndefined();
                    expect(TagSelectors.getTagErrors(state)).toEqual(undefined);
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
