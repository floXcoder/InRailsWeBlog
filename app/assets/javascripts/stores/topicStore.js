'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';

import TopicActions from '../actions/topicActions';

export default class TopicStore extends mix(Reflux.Store).with(Errors) {
    constructor() {
        super();

        this.listenables = TopicActions;
        this.url = (userId) => `/users/${userId}/topics`;
    }

    onLoadTopics(userId, data) {
        if ($.isEmpty(userId)) {
            log.error('Tried to load topics without user');
            return;
        }

        const url = this.url(userId);

        let requestParam = {};

        if (data) {
            if (!data.page && !data.limit) {
                requestParam.page = 1;
            }
        }

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadTopics',
                        topics: dataReceived.topics
                    });
                } else {
                    log.error('No data received from load topics');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onSwitchTopic(userId, topicId) {
        if ($.isEmpty(userId) || $.isEmpty(topicId)) {
            log.error('Tried to switch topic without data');
            return;
        }

        const url = this.url(userId) + '/switch';

        let requestParam = {
            new_topic_id: topicId
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    $app.user.currentTopic = _.omit(dataReceived.topic, ['tags']);
                    $app.user.tags = dataReceived.topic.tags || [];

                    this.trigger({
                        type: 'switchTopic',
                        topic: dataReceived.topic
                    });
                } else {
                    log.error('No data received from update topic');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'changeTopicError',
                        topicErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onAddTopic(userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic)) {
            log.error('Tried to push topic without topic data');
            return;
        }

        const url = this.url(userId);

        let requestParam = {
            topic: topic
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    // Switch topic to the new topic
                    $app.user.currentTopic = _.omit(dataReceived.topic, ['tags']);
                    $app.user.tags = [];

                    this.trigger({
                        type: 'addTopic',
                        topic: dataReceived.topic
                    });
                } else {
                    log.error('No data received from add topic');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'addTopicError',
                        topicErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onUpdateTopic(userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic) || $.isEmpty(topic.id)) {
            log.error('Tried to update topic without data');
            return;
        }

        const url = this.url + '/' + userId + '/topic/' + topic.id;

        let requestParam = {
            _method: 'put',
            topic: topic
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'updateTopic',
                        topic: dataReceived.topic
                    });
                } else {
                    log.error('No data received from update topic');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'updateTopicError',
                        topicErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onDeleteTopic(userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic)) {
            log.error('Tried to delete topic without topic');
            return;
        }

        let url = this.url + '/' + userId + '/topic';

        let requestParam = {};

        if (topic.id) {
            url += topic.id;
            requestParam._method = 'delete';
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'deleteTopic',
                        deleteTopic: dataReceived
                    });
                } else {
                    log.error('No data received from delete topic');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }
}
