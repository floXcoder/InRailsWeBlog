'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';

import UploadActions from '../actions/uploadActions';

export default class UploadStore extends mix(Reflux.Store).with(Errors) {
    constructor() {
        super();

        this.listenables = UploadActions;
        this.url = '/uploads';
    }

    // Called by handleErrors function of Errors mixin
    displayUnauthorizedMessage() {
        Notification.error(I18n.t('js.helpers.errors.not_authorized'));
    }

    // Called by handleErrors function of Errors mixin
    displayErrorsMessage(url, errorMessage) {
    }

    onAddUpload(upload, options) {
        if ($.isEmpty(upload)) {
            log.error('Tried to add a upload without data');
            return;
        }

        const url = this.url;

        let requestParam = {
            upload: upload
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'addUpload',
                        upload: dataReceived.upload
                    });
                } else {
                    log.error('No data received from add upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'addUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(url, xhr, status, error);
                }
            });
    }

    onUpdateUpload(upload, options) {
        if ($.isEmpty(upload) || $.isEmpty(upload.id)) {
            log.error('Tried to update a upload without data');
            return;
        }

        const url = this.url + '/' + upload.id;

        let requestParam = {
            upload: upload,
            _method: 'put'
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'updateUpload',
                        upload: dataReceived.upload
                    });
                } else {
                    log.error('No data received from update upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'updateUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(url, xhr, status, error);
                }
            });
    }

    onDeleteUpload(uploadId, options) {
        if ($.isEmpty(uploadId)) {
            log.error('Tried to remove a upload without upload id');
            return;
        }

        const url = this.url + '/' + uploadId;

        let requestParam = {
            _method: 'delete'
        };

        if (options) {
            if (options.isPermanently) {
                requestParam.permanently = true
            }
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'deleteUpload',
                        deletedUpload: dataReceived
                    });
                } else {
                    log.error('No data received from delete upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'deleteUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(url, xhr, status, error);
                }
            });
    }
}
