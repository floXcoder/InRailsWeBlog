'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';

import AdminActions from '../actions/adminActions';

export default class AdminStore extends mix(Reflux.Store).with(Errors) {
    constructor() {
        super();

        this.listenables = AdminActions;
        this.url = '/admin/managers';
    }

    init() {
        return true;
    }

    onPendingValidation(data) {
        const url = this.url + '/pending_validation';

        let requestParam = {};

        if (data) {
            requestParam = data;
        }

        $.getJSON(
            url,
            requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'pendingValidation',
                        pendingValidation: dataReceived
                    });
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onPendingCommentDeletion(data) {
        const url = this.url + '/pending_comment_deletion';

        let requestParam = {};

        if (data) {
            requestParam = data;
        }

        $.getJSON(
            url,
            requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'pendingCommentDeletion',
                        pendingCommentDeletion: dataReceived
                    });
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onFlushCache() {
        const url = this.url + '/flush_cache';

        let requestParam = {};

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'flushCache',
                        flushCache: dataReceived
                    });
                } else {
                    log.error('No data received from flush cache');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onDumpDatabase(data) {
        const url = this.url + '/dump_database';

        let requestParam = {};

        if (data) {
            requestParam = data;
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
                        type: 'dumpDatabase',
                        dumpDatabase: dataReceived.dump_dir
                    });
                } else {
                    log.error('No data received from dump database');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onSeoSitemap() {
        const url = this.url + '/seo_sitemap';

        let requestParam = {};

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'seoSitemap',
                        seoSitemap: dataReceived
                    });
                } else {
                    log.error('No data received from seo sitemap');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onSeoRefreshSlug() {
        const url = this.url + '/seo_slug';

        let requestParam = {};

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'seoRefreshSlug',
                        seoRefreshSlug: dataReceived
                    });
                } else {
                    log.error('No data received from seo refresh slug');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }
}
