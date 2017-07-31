'use strict';

const TrackerMixin = (superclass) => class extends superclass {
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
        });

        return true;
    }

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
        });

        return true;
    }
};

export default TrackerMixin;
