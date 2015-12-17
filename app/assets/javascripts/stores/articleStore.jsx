'use strict';

var History = require('../mixins/history');
var Errors = require('../mixins/errors');
var Comments = require('../mixins/comments');
var Tracker = require('../mixins/tracker');

var ArticleActions = require('../actions/articleActions');

var ArticleStore = Reflux.createStore({
    mixins: [History, Errors, Comments, Tracker],
    listenables: [ArticleActions],
    articleData: {},
    activeTags: {},
    autocompleteValues: {},
    url: '/articles',
    initRequest: {},
    lastRequest: {},
    hasMore: true,
    paramsFromUrl: {},
    browserState: {},

    init () {
        // Will call handleParams
        this.bindToBrowser();
    },

    onInitStore (initialRequest) {
        this.initRequest = initialRequest;

        _.defer(() => {
            if (!$.isEmpty(this.browserState)) {
                if (this.browserState.query) {
                    this.paramsFromUrl = {query: this.browserState.query, tags: this.browserState.tags};
                    this.onSearchArticles({query: this.browserState.query, tags: this.browserState.tags});
                } else {
                    this.paramsFromUrl = this.browserState;
                    this.onLoadArticles(this.browserState);
                }
            } else {
                var request = this.initRequest;

                // No need of user id or pseudo if mode used
                if (!$.isEmpty(this.initRequest.pseudo) && !$.isEmpty(this.initRequest.mode)) {
                    request = _.omit(request, 'userId');
                    request = _.omit(request, 'pseudo');
                }

                this.onLoadArticles(request);
            }
        });
    },

    deserializeParams (state) {
        var tags = [];
        if (state.query) {
            return {
                query: state.query,
                tags: tags
            };
        } else if (state.tags) {
            state.tags.split(',').forEach((tag) => {
                tags.push(tag);
            });
            return {
                tags: tags
            };
        } else if (state.relation_tags) {
            state.relation_tags.split(',').forEach((tag) => {
                tags.push(tag);
            });
            return {
                relationTags: tags
            };
        } else if (!$.isEmpty(state)) {
            return state;
        }
    },

    handleParams (state) {
        if (!$.isEmpty(state)) {
            this.browserState = state;
        }
    },

    _saveRequest (data) {
        if ($.isEmpty(data)) {
            return;
        }

        var title = I18n.t('js.article.url');
        var savedParams = {};

        if (data.relationTags) {
            savedParams.relation_tags = data.relationTags.join(',');
            title = I18n.t('js.article.tag.url') + ' ' + data.relationTags;
        } else if (data.tags) {
            savedParams.tags = data.tags.join(',');
            title = I18n.t('js.article.tag.url') + ' ' + data.tags;
        } else {
            savedParams = data;
        }

        if (data.page && (data.page === '1' || data.page === 1)) {
            savedParams = _.omit(data, 'page');
        }

        savedParams = _.omit(savedParams, 'userId');

        title = `${I18n.t('js.common.website_name')} | ${title}`;
        this.saveState(savedParams, {title: title});
    },

    // Called by handleErrors function of Errors mixin
    displayUnauthorizedMessage () {
        Materialize.toast(I18n.t('js.article.model.errors.not_authorized'), 10000);
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
    },

    _resetSearch () {
        this.lastRequest = {};
        this.hasMore = true;
    },

    _fetchArticles (data, callback) {
        var requestParam = {};

        var url = this.url;

        if (data) {
            if (data.page) {
                requestParam.page = data.page;
            } else {
                requestParam.page = 1;
            }

            if (data.tags) {
                requestParam.tags = data.tags;
            }

            if (data.relationTags) {
                requestParam.relation_tags = data.relationTags;
            }

            if (data.userId) {
                requestParam.user_id = data.userId;
            }

            if (data.pseudo) {
                requestParam.user_pseudo = data.pseudo;
            }

            if (data.mode) {
                requestParam.mode = data.mode;
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

            if (data.history) {
                url += '/' + data.history + '/history';
            }

            if (data.restore) {
                requestParam.translation_version_id = data.restore.versionId;
                url += '/' + data.restore.articleId + '/restore';
            }
        }

        this.lastRequest = data;

        jQuery.getJSON(
            url,
            requestParam,
            function (dataReceived) {
                if (!$.isEmpty(dataReceived)) {
                    callback.bind(this, dataReceived)();
                } else {
                    log.error('No data received from fetch articles');
                }
            }.bind(this))
            .fail(function (xhr, status, error) {
                this.handleErrors(url, xhr, status, error);
            }.bind(this));
    },

    onLoadArticles (data) {
        this._resetSearch();

        this._fetchArticles(data, (dataReceived) => {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.articleData.hasMore = true;

            this.trigger(this.articleData);

            if (!$.isEmpty(this.paramsFromUrl)) {
                this.paramsFromUrl = {};
            }

            this._saveRequest(data);
        });
    },

    onLoadNextArticles (data) {
        if (this.lastRequest.page) {
            this.lastRequest.page += 1;
        } else {
            this.lastRequest.page = 2;
        }

        this._fetchArticles(_.merge(this.lastRequest, data), (dataReceived) => {
            var uniqueArticles = [];
            var uniqueIds = {};

            this.articleData.articles.concat(dataReceived.articles).map((article) => {
                if (!uniqueIds[article.id]) {
                    uniqueArticles.push(article);
                    uniqueIds[article.id] = article;
                }
            });

            if (dataReceived.articles.length === 0) {
                this.hasMore = false;
            } else {
                this._saveRequest(_.merge(this.lastRequest, data));
            }

            // Manage in articles/box
            this.articleData.articles = uniqueArticles;
            this.articleData.hasMore = this.hasMore;
            this.trigger(this.articleData);
        });
    },

    onLoadArticlesByTag (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to load articles by tag without tag data');
            return;
        }

        var url = '';

        if (data.tags) {
            url = 'tags=' + data.tags.join(',');
        }
        if (data.relationTags) {
            url = 'relationTags=' + data.relationTags.join(',');
        }

        if ($(location).attr('pathname') !== '/' && !/\/users\//i.test($(location).attr('pathname'))) {
            window.location.replace('/?' + url);
        }

        this.onLoadArticles(data);
    },

    onAddArticle (article) {
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
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    // Add to the current list
                    this.articleData.articles.unshift(dataReceived.article);
                    this.trigger(this.articleData);
                } else {
                    log.error('No data received from add article');
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(this.url, xhr, status, error);
            }
        });
    },

    onUpdateArticle (article) {
        if ($.isEmpty(article)) {
            log.error('Tried to update article without article');
            return;
        }

        var requestParam = {};
        var url = this.url;
        var fromEditPage = article.fromEditPage;

        if (article && article.id) {
            url += '/' + article.id;
            requestParam._method = 'put';

            requestParam.articles = article;
        } else {
            return;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    if (fromEditPage && dataReceived.article) {
                        window.location.replace("/articles/" + dataReceived.article.id);
                    } else {
                        // Update the articles
                        var updatedArticleList = [];
                        var updatedArticle = dataReceived.article;
                        this.articleData.articles.forEach((article, index, articles) => {
                            if (updatedArticle.id === article.id) {
                                updatedArticleList.push(updatedArticle);
                            } else {
                                updatedArticleList.push(article);
                            }
                        });
                        this.articleData.articles = updatedArticleList;
                        this.trigger(this.articleData);
                    }
                } else {
                    log.error('No data received from update article');
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    },

    onDeleteArticle (article) {
        if ($.isEmpty(article)) {
            log.error('Tried to delete article without article');
            return;
        }

        var requestParam = {};
        var url = this.url;
        var showMode = false;

        if (article) {
            if (article.id) {
                url += '/' + article.id;
                requestParam._method = 'delete';
            }
            if (article.showMode) {
                showMode = true;
            }
        } else {
            return;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: (dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    if (showMode && dataReceived.id) {
                        window.location.replace("/");
                    } else {
                        // Remove the article
                        var updatedArticleList = [];
                        var removedArticleId = dataReceived.id;
                        this.articleData.articles.forEach((article, index, articles) => {
                            if (removedArticleId !== article.id) {
                                updatedArticleList.push(article);
                            }
                        });
                        this.articleData.articles = updatedArticleList;
                        this.trigger(this.articleData);

                        if (dataReceived.url) {
                            Materialize.toast(I18n.t('js.article.flash.deletion_successful') + ' ' + '<a href=' + dataReceived.url + '>' + I18n.t('js.article.flash.undelete_link') + '</a>');
                        }
                    }
                } else {
                    log.error('No data received from delete article');
                }
            },
            error: (xhr, status, error) => {
                this.handleErrors(url, xhr, status, error);
            }
        });
    },

    onSearchArticles (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to search for articles without data');
            return;
        }

        this._resetSearch();

        if ($.isEmpty(this.paramsFromUrl)) {
            var queryParams = {
                query: data.query,
                tags: data.tags ? data.tags.join(',') : null
            };
            this.saveState(queryParams, {title: I18n.t('js.article.search.url') + ' ' + queryParams.query});
        }

        this._fetchArticles(data, (dataReceived) => {
            // Manage in articles/box and search/module
            this.articleData = dataReceived;
            this.articleData.hasMore = true;

            if (!$.isEmpty(this.paramsFromUrl)) {
                this.articleData.paramsFromUrl = this.paramsFromUrl;
            }
            this.trigger(this.articleData);

            if (!$.isEmpty(this.paramsFromUrl)) {
                delete this.articleData.paramsFromUrl;
                this.paramsFromUrl = {};
            }

            _paq.push(['trackSiteSearch', data.query, 'Search', this.articleData.length]);
        });
    },

    onAutosaveArticle (data) {
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
    },

    onAutocompleteArticles (data) {
        if ($.isEmpty(data) || $.isEmpty(data.autocompleteQuery)) {
            log.error('Tried to autocomplete articles without data');
            return;
        }

        this._fetchArticles(data, (dataReceived) => {
            this.autocompleteValues = dataReceived.articles;
            this.trigger({autocompletion: this.autocompleteValues});
        });
    },

    _filterArticlesByTag () {
        if ($.isEmpty(this.activeTags)) {
            log.error('Tried to filter articles but active tags is null');
            return;
        }

        this.articleData.articles.forEach((article, index, articles) => {
            articles[index].show = true;
            var activeTagsByArticle = article.tags.filter((tag) => {
                if (!this.activeTags.hasOwnProperty(tag.id)) {
                    this.activeTags[tag.id] = true
                }
                return this.activeTags[tag.id];
            });
            if (activeTagsByArticle.length === 0) {
                articles[index].show = false;
            }
        });
    },

    onFilterArticlesByTag (tagId, activeTag) {
        if ($.isEmpty(tagId) || $.isEmpty(activeTag)) {
            log.error('Tried to filter articles without tag id or active tag');
            return;
        }

        this.activeTags[tagId] = activeTag;
        this._filterArticlesByTag();
        this.trigger(this.articleData);

        _paq.push(['trackSiteSearch', tagId, 'Tags']);
    },

    onLoadArticleHistory (data) {
        if ($.isEmpty(data.history)) {
            log.error('Tried to load article history without data');
            return;
        }

        this._fetchArticles(data, (dataReceived) => {
            this.trigger({articleVersions: dataReceived['paper_trail/versions']});
        });
    },

    onRestoreArticle (data) {
        if ($.isEmpty(data.restore)) {
            log.error('Tried to restore article without data');
            return;
        }

        this._fetchArticles(data, (dataReceived) => {
            this.trigger({articleRestored: dataReceived.article});
        });
    },

    onBookmarkArticle (data) {
        if ($.isEmpty(data.articleId)) {
            log.error('Tried to bookmark an article article id');
            return;
        }

        var requestParam = {};

        requestParam.article_id = data.articleId;
        var url = this.url + '/' + data.articleId + '/bookmark';

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
});

module.exports = ArticleStore;
