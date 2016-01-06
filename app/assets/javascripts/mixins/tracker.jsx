'use strict';

var TrackerMixin = {
    onTrackClick: function (elementId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track click without element id or name');
            return;
        }

        let url = this.url + '/' + elementId + '/clicked';

        let requestParam = {
            id: elementId
        };

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

        return true;
    },

    onTrackView: function (elementId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track view without element id or name');
            return;
        }

        let url = this.url + '/' + elementId + '/viewed';

        let requestParam = {
            id: elementId
        };

        $.ajax({
            url: url,
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

        return true;
    }
};

module.exports = TrackerMixin;
