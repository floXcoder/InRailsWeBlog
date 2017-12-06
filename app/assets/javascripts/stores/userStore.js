'use strict';

import _ from 'lodash';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';
import Tracker from '../mixins/tracker';
import LocalData from '../mixins/local-data';

import UserActions from '../actions/userActions';

export default class UserStore extends mix(Reflux.Store).with(Errors, Tracker, LocalData) {
    constructor() {
        super();

        this.listenables = UserActions;
        this.url = '/users';

        // TODO: use redux global state instead of $app
        if ($app.isUserConnected()) {
            this.onLoadUser({userId: $app.user.currentId, userProfile: true});
        }
    }

    onLoadUsers(data) {
        const url = this.url;

        let requestParam = {};

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
                    log.error('No data received from load users');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onValidation(data) {
        if ($.isEmpty(data)) {
            log.error('Tried to validate user without data');
            return;
        }

        const url = this.url + '/validation';

        let requestParam = data;

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger(dataReceived);
                } else {
                    log.error('No data received from user validation');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onLoadUser(data) {
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
                    $app.user.current = _.omit(dataReceived.user, ['settings', 'current_topic', 'topics']);
                    $app.user.settings = dataReceived.user.settings;
                    $app.user.currentTopic = dataReceived.user.current_topic;
                    $app.user.topics = dataReceived.user.topics;
                    $app.user.tags = dataReceived.user.tags || [];

                    if (data.userProfile) {
                        this.trigger({
                            type: 'initUser',
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
    }

    onLoadUserComments(userId, data) {
        if ($.isEmpty(userId)) {
            log.error('Tried to load user comment without user id');
            return;
        }

        const url = this.url + '/' + userId + '/comments';

        let requestParam = {};

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
    }

    onLoadUserActivities(userId, data) {
        if ($.isEmpty(userId)) {
            log.error('Tried to load user activities without user id');
            return;
        }

        const url = this.url + '/' + userId + '/activities';

        let requestParam = {};

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
    }

    onUpdateUser(user) {
        if ($.isEmpty(user) || $.isEmpty(user.id)) {
            log.error('Tried to update user without user');
            return;
        }

        const url = this.url + '/' + user.id;

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
    }

    onUpdateSettings(data) {
        if ($.isEmpty(data)) {
            log.error('Tried to change user settings without data');
            return;
        }

        const url = this.url + '/' + this.user.id + '/settings';

        let requestParam = {
            settings: {}
        };

        if (data.displayType) {
            requestParam.settings.article_display = data.article_display;
        }
        if (data.searchOptions && data.searchOptions.search_highlight) {
            requestParam.settings.search_highlight = data.searchOptions.search_highlight;
        }
        if (data.searchOptions && data.searchOptions.search_operator) {
            requestParam.settings.article_display = data.searchOptions.search_operator;
        }
        if (data.searchOptions && data.searchOptions.search_exact) {
            requestParam.settings.article_display = data.searchOptions.search_exact;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if ($app.user) {
                    $app.user.settings = dataReceived.settings;
                }

                this.trigger({
                    type: 'updateUserSettings',
                    settings: dataReceived.settings
                });

                return true;
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }
}
