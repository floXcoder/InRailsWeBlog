'use strict';

// user: {
//         settings: {
//         article_display: window.parameters.article_display,
//             search_highlight: window.parameters.search_highlight,
//             search_operator: window.parameters.search_operator,
//             search_exact: window.parameters.search_exact
//     },
// },

var App = function () {
    this.user = {
        currentId: $.isEmpty(window.currentUserId) ? null : parseInt(window.currentUserId, 10),
        current: null,
        topic: null,
        settings: null,
        isConnected: function () {
            return !!this.currentId && !$.isEmpty(this.current);
        },
        isPresent: function () {
            return !!this.currentId;
        },
        isValidUser: function (userId) {
            if (userId) {
                return (userId === this.currentUserId);
            } else {
                return false;
            }
        },
        isAdmin: function () {
            return !!this.current && this.current.admin;
        }
    };
};

App.prototype.init = function () {
};

module.exports = new App();

