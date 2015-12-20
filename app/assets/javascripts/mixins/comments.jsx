'use strict';

var CommentsMixin = {
    onAddComment (comment, commentableId) {
        if ($.isEmpty(comment) || $.isEmpty(commentableId)) {
            log.error('Tried to post a comment without comment or commentable id');
            return;
        }

        let url = this.url + '/' + commentableId + '/comments';
        let requestParam = {};
        requestParam.comments = {
            title: comment.title,
            body: comment.message,
            rating: comment.rating,
            parent_id: comment.parentCommentId
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    // Manage in ride/show
                    this.trigger(dataReceived);
                } else {
                    log.error('No data received from commentable: ' + url);
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    },

    onUpdateComment (comment, commentableId) {
        if ($.isEmpty(comment) || $.isEmpty(comment.id) || $.isEmpty(commentableId)) {
            log.error('Tried to update a comment without comment id or commentable id');
            return;
        }

        let url = this.url + '/' + commentableId + '/comments';
        let requestParam = {};
        requestParam.comments = {
            id: comment.id,
            title: comment.title,
            body: comment.message,
            rating: comment.rating,
            parent_id: comment.parentCommentId
        };
        requestParam._method = 'put';

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    // Manage in ride/show
                    this.trigger({updatedComment: dataReceived.comment});
                } else {
                    log.error('No data received from update commentable: ' + url);
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    },

    onDeleteComment (commentId, commentableId) {
        if ($.isEmpty(commentId) || $.isEmpty(commentableId)) {
            log.error('Tried to remove a comment without comment id or commentable id');
            return;
        }

        let url = this.url + '/' + commentableId + '/comments';
        let requestParam = {};
        requestParam.comments = {
            id: commentId
        };
        requestParam._method = 'delete';

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    // Manage in ride/show
                    this.trigger({deletedComment: dataReceived});
                } else {
                    log.error('No data received from delete commentable: ' + url);
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    }
};

module.exports = CommentsMixin;
