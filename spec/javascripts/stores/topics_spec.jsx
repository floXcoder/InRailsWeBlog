'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as TopicActions from '../../../app/assets/javascripts/actions/topicActions';
import * as TopicSelectors from '../../../app/assets/javascripts/selectors/topicSelectors';

describe('Topics actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('fetchTopics', () => {
        it('should fetch all topics', () => {
            const topics = FactoryGenerator.create('topics', {number: 3});

            mock('/api/v1/topics.json?userId=1', 200, () => ({
                    topics,
                    meta: {
                        pagination: {
                            currentPage: 1,
                            totalPages: 3,
                            totalCount: 26
                        }
                    }
                })
            );

            return dispatch(store, TopicActions.fetchTopics(1))
                .then((state) => {
                    expect(state.topicState.topics).toHaveLength(topics.length);
                    expect(state.topicState.pagination.currentPage).toEqual(1);
                    expect(state.topicState.pagination.totalPages).toEqual(3);
                });
        });
    });

    describe('fetchTopic', () => {
        it('should fetch one topic', () => {
            const topic = FactoryGenerator.create('topics');

            mock(`/api/v1/topics/${topic.id}.json?userId=1`, 200, () => ({
                    topic: topic
                })
            );

            return dispatch(store, TopicActions.fetchTopic(1, topic.id))
                .then((state) => {
                    expect(state.topicState.topic.id).toEqual(topic.id);
                });
        });
    });

    describe('switchTopic', () => {
        it('should switch of topic', () => {
            const topic = FactoryGenerator.create('topics');

            mock('/api/v1/topics/switch.json', 200, () => ({
                    topic
                })
            );

            return dispatch(store, TopicActions.switchTopic())
                .then((state) => {
                    expect(state.topicState.currentTopic.id).toEqual(topic.id);
                    expect(TopicSelectors.getCurrentUserTopicVisibility(state)).toEqual('everyone');
                });
        });
    });

    describe('addTopic', () => {
        it('should create a topic', () => {
            const newTopic = FactoryGenerator.create('topics');

            mock('/api/v1/topics', 200, (request) => ({
                    topic: request.topic
                })
            );

            return dispatch(store, TopicActions.addTopic(1, newTopic))
                .then((state) => {
                    expect(state.topicState.currentTopic.id).toEqual(newTopic.id);
                    expect(TopicSelectors.getCurrentUserTopicVisibility(state)).toEqual('everyone');
                    expect(TopicSelectors.getTopicErrors(state)).toEqual(undefined);
                });
        });

        it('should not create a topic with errors', () => {
            const newTopic = FactoryGenerator.create('topics');
            const nameError = 'too short';

            mock('/api/v1/topics', 422, () => ({
                    errors: {name: [nameError]}
                })
            );

            return dispatch(store, TopicActions.addTopic(1, newTopic))
                .then((state) => {
                    expect(state.topicState.currentTopic).toBeUndefined();
                    expect(TopicSelectors.getTopicErrors(state)).toEqual([I18n.t('js.topic.model.name') + ' ' + nameError]);
                });
        });
    });

    describe('updateTopic', () => {
        it('should update a topic', () => {
            const topic = FactoryGenerator.create('topics');
            const updateParameters = {name: 'Updated topic name'};

            mock(`/api/v1/topics/${topic.id}`, 200, (request) => ({
                    topic: {...topic, ...request.topic}
                })
            );

            return dispatch(store, TopicActions.updateTopic(1, {id: topic.id, ...updateParameters}))
                .then((state) => {
                    expect(state.topicState.currentTopic.id).toEqual(topic.id);
                    expect(TopicSelectors.getTopicErrors(state)).toEqual(undefined);
                });
        });
    });

    describe('deleteTopic', () => {
        it('should delete a topic', () => {
            const topic = FactoryGenerator.create('topics');

            mock(`/api/v1/topics/${topic.id}`, 204);

            return dispatch(store, TopicActions.deleteTopic(1, topic.id))
                .then((state) => {
                    expect(TopicSelectors.getTopicErrors(state)).toEqual(undefined);
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
