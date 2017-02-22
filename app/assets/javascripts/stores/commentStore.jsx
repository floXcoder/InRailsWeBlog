'use strict';

var Errors = require('../mixins/errors');

var CommentActions = require('../actions/commentActions');

var CommentStore = Reflux.createStore({
    mixins: [Errors],
    listenables: [CommentActions],
    url: '/comments',

    // Called by handleErrors function from Errors mixin
    displayUnauthorizedMessage () {
    },

    // Called by handleErrors function of Errors mixin
    displayErrorsMessage (url, errorMessage) {
        if (url.includes('comments')) {
            Object.keys(errorMessage).forEach((errorField) => {
                Materialize.toast(
                    I18n.t('js.comment.model.errors.' + errorField,
                        {
                            message: errorMessage[errorField],
                            defaults: [{scope: 'js.comment.model.errors.default'}]
                        })
                );
            });
        }
    },

    _fetchComments (data, callback) {
        let requestParam = {};

        let url = this.url;

        if (data) {
            requestParam = {};

            if (data.commentableType && data.commentableId) {
                url = `/${data.commentableType}/${data.commentableId}/comments`;
            } else if (data.commentableId) {
                url = data.commentableId + url;
            }

            if (data.page) {
                requestParam.page = data.page;
            } else if (data.isPaginated) {
                requestParam.page = 1;
            }
        }

        $.getJSON(url, requestParam)
            .done(function (dataReceived) {
                if (!$.isEmpty(dataReceived)) {
                    callback.bind(this, dataReceived)();
                } else {
                    log.error('No data received from fetch comments');
                }
            }.bind(this))
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onLoadComments (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to load comments without data');
            return;
        }

        this._fetchComments(data, (dataReceived) => {
            this.trigger({
                type: 'loadComments',
                comments: dataReceived.comments,
                pagination: dataReceived.meta
            });
        });
    },

    onAddComment (comment, commentableId, commentableType) {
        if ($.isEmpty(comment) || $.isEmpty(commentableId)) {
            log.error('Tried to post a comment without comment or commentable id');
            return;
        }

        let url = this.url;
        if (commentableType && commentableId) {
            url = `/${commentableType}/${commentableId}/comments`;
        } else if (commentableId) {
            url = commentableId + url;
        }

        let requestParam = {};
        requestParam.comment = comment;

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'addComment',
                        comment: dataReceived.comment
                    });
                } else {
                    log.error('No data received from commentable: ' + url);
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onUpdateComment (comment, commentableId, commentableType) {
        if ($.isEmpty(comment) || $.isEmpty(comment.id) || $.isEmpty(commentableId)) {
            log.error('Tried to update a comment without comment id or commentable id');
            return;
        }

        let url = this.url;
        if (commentableType && commentableId) {
            url = `/${commentableType}/${commentableId}/comments`;
        } else if (commentableId) {
            url = commentableId + url;
        }

        let requestParam = {};
        requestParam._method = 'put';
        requestParam.comment = comment;

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'updateComment',
                        comment: dataReceived.comment
                    });
                } else {
                    log.error('No data received from update commentable: ' + url);
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    },

    onDeleteComment (commentId, commentableId, commentableType, options) {
        if ($.isEmpty(commentId) || $.isEmpty(commentableId)) {
            log.error('Tried to remove a comment without comment id or commentable id');
            return;
        }

        let url = this.url;
        if (commentableType && commentableId) {
            url = `/${commentableType}/${commentableId}/comments`;
        } else if (commentableId) {
            url = commentableId + url;
        }

        let requestParam = {};
        requestParam._method = 'delete';
        requestParam.comment = {
            id: commentId
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
                        type: 'deleteComment',
                        deletedCommentIds: dataReceived.deleted_comment_ids
                    });
                } else {
                    log.error('No data received from delete commentable: ' + url);
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }
});

module.exports = CommentStore;
