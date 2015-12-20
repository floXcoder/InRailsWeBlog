'use strict';

var TrackerMixin = {
    onTrackClick: function (elementId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track click without element id or name');
            return;
        }

        let url = this.url + '/' + elementId + '/clicked';

        let requestParam = {};

        $.ajax({
            url: url,
            async: false,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
                return true;
            },
            error: function (xhr, status, error) {
                return false;
            }
        });
    },

    onTrackView: function (elementId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track view without element id or name');
            return;
        }

        let url = this.url + '/' + elementId + '/viewed';

        let requestParam = {};

        $.ajax({
            url: url,
            async: false,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
                return true;
            }.bind(this),
            error: function (xhr, status, error) {
                return false;
            }.bind(this)
        });
    }
};

module.exports = TrackerMixin;
