'use strict';

var Errors = require('../mixins/errors');
var Tracker = require('../mixins/tracker');

var UserActions = require('../actions/userActions');

var UserStore = Reflux.createStore({
    mixins: [Errors, Tracker],
    listenables: [UserActions],
    url: '/users',

    init () {
        if ($app.user.currentId) {
            this.onLoadUser({userId: $app.user.currentId, userProfile: true});
        }

        return true;
    },

    onLoadUsers (data) {
        let requestParam = {};

        let url = this.url;

        if (data) {
            if (!data.page && !data.limit) {
                requestParam.page = 1;
            }

            if (data.completeUser) {
                requestParam.complete_user = true;
            }
        }

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadUsers',
                        users: dataReceived.users,
                        pagination: dataReceived.meta
                    });
                } else {
                    log.error('No data received from fetch users');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onValidation (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to validate user without data');
            return;
        }

        const validationUrl = this.url + '/validation';

        let requestParam = data;

        $.getJSON(validationUrl, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger(dataReceived);
                } else {
                    log.error('No data received from user validation');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(validationUrl, xhr, status, error);
            });
    },

    onLoadUser (data) {
        if ($.isEmpty(data)) {
            return;
        }

        const url = this.url + '/' + data.userId;

        let requestParam = {};

        if (data.userProfile) {
            requestParam.user_profile = true;
        }

        if (data.completeUser) {
            requestParam.complete_user = true;
        }

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    $app.user.preferences = _.pick(dataReceived.user, ['preferences']);
                    $app.user.topic = _.merge(_.pick(dataReceived.user, ['current_topic']), _.pick(dataReceived.user, ['topics']));
                    $app.user.current = _.omit(dataReceived.user, ['preferences', 'current_topic', 'topics']);

                    if (data.userProfile) {
                        this.trigger({
                            type: 'loadUser',
                            user: $app.user.current
                        });
                    } else {
                        this.trigger({
                            type: 'loadUser',
                            user: dataReceived.user
                        });
                    }
                } else {
                    log.error('No data received from load user');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onLoadUserComments (userId, data) {
        if ($.isEmpty(userId)) {
            log.error('Tried to load user comment without user id');
            return;
        }

        let requestParam = {};

        let url = this.url + '/' + userId + '/comments';

        if (data) {
            requestParam = data;

            if (!data.page && !data.limit) {
                requestParam.page = 1;
            }
        }

        $.getJSON(
            url,
            requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadUserComments',
                        comments: dataReceived.comments,
                        pagination: dataReceived.meta
                    });
                } else {
                    log.error('No data received from fetch users');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onLoadUserActivities (userId, data) {
        if ($.isEmpty(userId)) {
            log.error('Tried to load user activities without user id');
            return;
        }

        let requestParam = {};

        let url = this.url + '/' + userId + '/activities';

        if (data) {
            requestParam = data;

            if (!data.page && !data.limit) {
                requestParam.page = 1;
            }
        }

        $.getJSON(
            url,
            requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadUserActivities',
                        activities: dataReceived['public_activity/activities'],
                        pagination: dataReceived.meta
                    });
                } else {
                    log.error('No data received from fetch users');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onUpdateUser (user) {
        if ($.isEmpty(user) || $.isEmpty(user.id)) {
            log.error('Tried to update user without user');
            return;
        }

        let url = this.url + '/' + user.id;

        let requestParam = {
            _method: 'put',
            user: user
        };

        if (user.completeUser) {
            requestParam.complete_user = true;
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
                        type: 'updateUser',
                        user: dataReceived.user
                    });
                } else {
                    log.error('No data received from update user');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onUpdatePreference (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to change user preference without data');
            return;
        }

        let requestParam = {};
        requestParam.preferences = {};

        const url = this.url + '/' + this.user.id + '/preferences';

        if (data.displayType) {
            requestParam.preferences.article_display = data.article_display;
        }
        if (data.searchOptions && data.searchOptions.search_highlight) {
            requestParam.preferences.search_highlight = data.searchOptions.search_highlight;
        }
        if (data.searchOptions && data.searchOptions.search_operator) {
            requestParam.preferences.article_display = data.searchOptions.search_operator;
        }
        if (data.searchOptions && data.searchOptions.search_exact) {
            requestParam.preferences.article_display = data.searchOptions.search_exact;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if ($app.user) {
                    $app.user.preferences = dataReceived.preferences;
                }

                this.trigger({
                    type: 'updateUserPreference',
                    preferences: dataReceived.preferences
                });

                return true;
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onAddTopic (userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic)) {
            log.error('Tried to push topic without topic');
            return;
        }

        var requestParam = {};

        if (topic) {
            requestParam.topic = topic;
        } else {
            return;
        }

        $.ajax({
            url: this.url + '/' + userId + '/topic',
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
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
    },

    onChangeTopic (userId, topicId) {
        if ($.isEmpty(userId) || $.isEmpty(topicId)) {
            log.error('Tried to change topic without data');
            return;
        }

        var url = this.url + '/' + userId + '/change_topic';
        var requestParam = {
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
                    this.trigger({
                        type: 'changeTopic',
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
    },

    onUpdateTopic (userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic) || $.isEmpty(topic.id)) {
            log.error('Tried to update topic without data');
            return;
        }

        var url = this.url + '/' + userId + '/topic/' + topic.id;
        var requestParam = {
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
    },

    onDeleteTopic (userId, topic) {
        if ($.isEmpty(userId) || $.isEmpty(topic)) {
            log.error('Tried to delete topic without topic');
            return;
        }

        let requestParam = {};
        let url = this.url + '/' + userId + '/topic';

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
});

module.exports = UserStore;
