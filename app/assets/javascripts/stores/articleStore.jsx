'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';
import Tracker from '../mixins/tracker';

import ArticleActions from '../actions/articleActions';

export default class ArticleStore extends mix(Reflux.Store).with(Errors, Tracker) {
    constructor() {
        super();

        this.listenables = ArticleActions;
        this.url = '/articles';
    }

    // Called by handleErrors function of Errors mixin
    displayUnauthorizedMessage() {
        Materialize.toast(I18n.t('js.article.errors.not_authorized'), 10000);
    }

    // Called by handleErrors function of Errors mixin
    displayErrorsMessage(url, errorMessage) {
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
        } else if (url.includes('bookmark')) {
            Object.keys(errorMessage).forEach((errorField) => {
                Materialize.toast(
                    I18n.t('js.article.model.errors.bookmark.' + errorField,
                        {
                            message: errorMessage[errorField],
                            defaults: [{scope: 'js.article.model.errors.bookmark.default'}]
                        })
                );
            });
        } else {
            Object.keys(errorMessage).forEach((errorField) => {
                Materialize.toast(
                    I18n.t('js.article.model.errors.' + errorField,
                        {
                            message: errorMessage[errorField],
                            defaults: [{scope: 'js.article.model.errors.default'}]
                        })
                );
            });
        }
    }

    _fetchArticles(data, callback) {
        let requestParam = {};

        let url = this.url;

        if (data) {
            if (data.page) {
                requestParam.page = data.page;
            } else {
                requestParam.page = 1;
            }

            if (data.tagName) {
                requestParam.tags = [data.tagName];
            }
            if (data.tags) {
                requestParam.tags = data.tags;
            }

            if (data.parentTags) {
                requestParam.parent_tags = data.parentTags;
            }

            if (data.childTags) {
                requestParam.child_tags = data.childTags;
            }

            if (data.userId) {
                requestParam.user_id = data.userId;
            }

            if (data.userPseudo) {
                requestParam.user_pseudo = data.userPseudo;
            }

            if (data.topicId) {
                requestParam.topic_id = data.topicId;
            }

            if (data.type) {
                requestParam.type = data.type;
            }

            if (data.summary) {
                requestParam.summary = data.summary;
            }

            if (data.query) {
                requestParam.query = data.query;
                url += '/search';

                if (data.searchOptions) {
                    requestParam.search_options = data.searchOptions;
                }
            }

            if (data.autocompleteQuery) {
                requestParam.autocompleteQuery = data.autocompleteQuery;
                url += '/autocomplete';
            }
        }

        $.getJSON(
            url,
            requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    callback.bind(this, dataReceived)();
                } else {
                    log.error('No data received from fetch articles');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onLoadArticles(data) {
        this._fetchArticles(data, (dataReceived) => {
            if (!$.isEmpty(dataReceived)) {
                this.trigger({
                    type: 'loadArticles',
                    articles: dataReceived.articles,
                    pagination: dataReceived.meta
                });
            }
        });
    }

    onSearchArticles(data) {
        if ($.isEmpty(data)) {
            log.error('Tried to search for articles without data');
            return;
        }

        this._fetchArticles(data, (dataReceived) => {
            this.trigger({
                type: 'searchArticles',
                articles: dataReceived.articles
            });

            _paq.push(['trackSiteSearch', data.query, 'Search', this.articleData.length]);
        });
    }

    onAutocompleteArticles(data) {
        if ($.isEmpty(data) || $.isEmpty(data.autocompleteQuery)) {
            log.error('Tried to autocomplete articles without data');
            return;
        }

        this._fetchArticles(data, (dataReceived) => {
            // this.trigger({autocompletion: this.autocompleteValues});
            this.trigger({
                type: 'autocompleteArticles',
                autocompletion: dataReceived
            });
        });
    }

    onLoadArticle(data) {
        if ($.isEmpty(data) && (!data.id || !data.slug)) {
            log.error('Tried to load article without data');
            return;
        }

        let requestParam = {};

        let url = this.url + '/';
        if (data.id) {
            url += data.id;
        } else if (data.slug) {
            url += data.slug;
        }

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'loadArticle',
                        article: dataReceived.article
                    });
                } else {
                    log.error('No data received from fetch articles');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onAddArticle(article) {
        if ($.isEmpty(article)) {
            log.error('Tried to push article without article');
            return;
        }

        var requestParam = {};

        if (article) {
            requestParam.articles = article;
        } else {
            return;
        }

        $.ajax({
            url: this.url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'addArticle',
                        article: dataReceived.article
                    });
                } else {
                    log.error('No data received from add article');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'addArticleError',
                        articleErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onUpdateArticle(article) {
        if ($.isEmpty(article) || $.isEmpty(article.id)) {
            log.error('Tried to update article without data');
            return;
        }

        var url = this.url + '/' + article.id;
        var requestParam = {
            _method: 'put',
            articles: article
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
                        type: 'updateArticle',
                        article: dataReceived.article
                    });
                } else {
                    log.error('No data received from update article');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'updateArticleError',
                        articleErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onDeleteArticle(article) {
        if ($.isEmpty(article)) {
            log.error('Tried to delete article without article');
            return;
        }

        let requestParam = {};
        let url = this.url;
        let showMode = false;

        if (article.id) {
            url += '/' + article.id;
            requestParam._method = 'delete';
        }
        if (article.showMode) {
            showMode = true;
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
                        type: 'deleteArticle',
                        deletedArticle: dataReceived
                    });
                } else {
                    log.error('No data received from delete article');
                }
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onAutosaveArticle(data) {
        if ($.isEmpty(data)) {
            log.error('Tried to autosave article without data');
            return;
        }

        let requestParam = {};
        requestParam.articles = data;

        $.ajax({
            url: this.url,
            async: false,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (data) => {
                return true
            },
            error: (xhr, status, error) => {
                return false
            }
        });
    }

    onLoadArticleHistory(data) {
        if ($.isEmpty(data.history)) {
            log.error('Tried to load article history without data');
            return;
        }

        const url = this.url + '/' + data.history + '/history';
        const requestParam = {};

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                this.trigger({
                    type: 'loadArticleHistory',
                    articleVersions: dataReceived['paper_trail/versions'] || []
                });
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onRestoreArticle(data) {
        if ($.isEmpty(data.restore)) {
            log.error('Tried to restore article without data');
            return;
        }

        const url = this.url + '/' + data.restore.articleId + '/restore';
        const requestParam = {
            version_id: data.restore.versionId
        };

        $.getJSON(url, requestParam)
            .done((dataReceived) => {
                this.trigger({
                    type: 'restoreArticle',
                    articleRestored: dataReceived.article
                });
            })
            .fail((xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            });
    }

    onBookmarkArticle(data) {
        if ($.isEmpty(data.articleId)) {
            log.error('Tried to bookmark an article article id');
            return;
        }

        let requestParam = {};
        requestParam.article_id = data.articleId;

        let url = this.url + '/' + data.articleId + '/bookmark';

        if (data.isBookmarked) {
            requestParam._method = 'delete';
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (data.isBookmarked) {
                    Materialize.toast(I18n.t('js.article.bookmark.removed'), 3000);
                } else {
                    Materialize.toast(I18n.t('js.article.bookmark.added'), 3000);
                }
                return true;
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    }

    onVoteArticle(data) {
        if ($.isEmpty(data.articleId)) {
            log.error('Tried to vote for an article without article id');
            return;
        }

        let requestParam = {};
        requestParam.article_id = data.articleId;

        let url = this.url + '/' + data.articleId;
        if (data.isUp) {
            url += '/vote_up';
        } else {
            url += '/vote_down';
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                Materialize.toast(I18n.t('js.article.vote.added'), 3000);
                return true;
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    }

    onOutdateArticle(data) {
        if ($.isEmpty(data.articleId)) {
            log.error('Tried to outdate an article without article id');
            return;
        }

        let requestParam = {};
        requestParam.article_id = data.articleId;

        let url = this.url + '/' + data.articleId + '/outdate';

        if (data.isOutdated) {
            requestParam._method = 'delete';
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (data.isOutdated) {
                    Materialize.toast(I18n.t('js.article.outdated.removed'), 3000);
                } else {
                    Materialize.toast(I18n.t('js.article.outdated.added'), 3000);
                }
                return true;
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    }
}
