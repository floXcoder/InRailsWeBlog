'use strict';

var TrackerMixin = {
    onTrackClick (elementId, parentId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track click without element id or name');
            return;
        }

        const url = ((typeof this.url === 'function') ? this.url(parentId) : this.url) + '/' + elementId + '/clicked';

        const requestParam = {
            id: elementId
        };

        $.ajax({
            url: url,
            async: false,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        }).done((data) => {
                return true;
            }
        ).fail((xhr, status, error) => {
            return false;
        });

        return true;
    },

    onTrackView (elementId, parentId) {
        if ($.isEmpty(elementId)) {
            log.error('Tried to track view without element id or name');
            return;
        }

        const url = ((typeof this.url === 'function') ? this.url(parentId) : this.url) + '/' + elementId + '/viewed';

        const requestParam = {
            id: elementId
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((data) => {
                return true;
            })
            .fail((xhr, status, error) => {
                return false;
            });

        return true;
    }
};

module.exports = TrackerMixin;
