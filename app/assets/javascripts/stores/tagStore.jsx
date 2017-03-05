'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';
import Tracker from '../mixins/tracker';

import TagActions from '../actions/tagActions';

export default class TagStore extends mix(Reflux.Store).with(Errors, Tracker) {
    constructor() {
        super();

        this.listenables = TagActions;
        this.url = '/tags';
        this.userTags = [];
    }

    init() {
        this.onLoadTags({init: true, userTags: true});

        return true;
    }

    getInitialState() {
        return {
            type: 'userTags',
            userTags: this.userTags
        };
    }

    onLoadTags(params) {
        let requestParam = {};

        if (params) {
            requestParam.tags = {};

            if (params.userTags) {
                requestParam.user_tags = params.userTags;
            }

            if (params.userId) {
                requestParam.tags.user_id = params.userId;
            }

            if (params.topicId) {
                requestParam.tags.topic_id = params.topicId;
            }
        }

        $.getJSON(this.url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    if (params && params.init) {
                        this.userTags = dataReceived.tags;
                        this.trigger({
                            type: 'userTags',
                            userTags: dataReceived.tags
                        });
                    } else {
                        this.trigger({
                            type: 'loadTags',
                            tags: dataReceived.tags
                        });
                    }
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(this.url, xhr, status, error);
            });
    }

    onLoadTag(data) {
        if ($.isEmpty(data) && !data.id) {
            log.error('Tried to load tag without data');
            return;
        }

        let requestParam = {};

        let url = this.url + '/' + data.id;

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadTag',
                        tag: dataReceived.tag
                    });
                } else {
                    log.error('No data received from fetch tag');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onUpdateTag(tag) {
        if ($.isEmpty(tag) || $.isEmpty(tag.id)) {
            log.error('Tried to update tag without data');
            return;
        }

        var url = this.url + '/' + tag.id;
        var requestParam = {
            _method: 'put',
            tags: tag
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
                        type: 'updateTag',
                        tag: dataReceived.tag
                    });
                } else {
                    log.error('No data received from update tag');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'updateTagError',
                        tagErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onDeleteTag(tag) {
        if ($.isEmpty(tag)) {
            log.error('Tried to delete tag without tag');
            return;
        }

        let requestParam = {};
        let url = this.url;
        let showMode = false;

        if (tag.id) {
            url += '/' + tag.id;
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
                        type: 'deleteTag',
                        deletedTag: dataReceived
                    });
                } else {
                    log.error('No data received from delete tag');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }
}
