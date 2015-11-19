var ArticleActions = require('../actions/articleActions');

var History = require('../mixins/history');

var ArticleStore = Reflux.createStore({
    mixins: [History],
    // auto-connects actions with stores
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

    init: function () {
        // Will call handleParams
        this.bindToBrowser();
    },

    onInitStore: function (initialRequest) {
        this.initRequest = initialRequest;

        _.defer(function () {
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
        }.bind(this));
    },

    deserializeParams: function (state) {
        var tags = [];
        if (state.query) {
            return {
                query: state.query,
                tags: tags
            };
        } else if (state.tags) {
            state.tags.split(',').forEach(function (tag) {
                tags.push(tag);
            });
            return {
                tags: tags
            };
        } else if (state.relation_tags) {
            state.relation_tags.split(',').forEach(function (tag) {
                tags.push(tag);
            });
            return {
                relationTags: tags
            };
        } else if (!$.isEmpty(state)) {
            return state;
        }
    },

    handleParams: function (state) {
        if (!$.isEmpty(state)) {
            this.browserState = state;
        }
    },

    _saveRequest: function (data) {
        if ($.isEmpty(data)) {
            return;
        }

        var title = I18n.t('js.article.url');
        var savedParams = {};

        if (data.tags) {
            savedParams.tags = data.tags.join(',');
            title = I18n.t('js.article.tag.url') + ' ' + data.tags;
        }
        if (data.relationTags) {
            savedParams.relation_tags = data.relationTags.join(',');
            title = I18n.t('js.article.tag.url') + ' ' + data.relationTags;
        }
        if (data.page && (data.page === '1' || data.page === 1)) {
            savedParams = _.omit(data, 'page')
        }

        savedParams = _.omit(savedParams, 'userId');

        this.saveState(savedParams, {title: title});
    },

    _handleJsonErrors: function (xhr, status, error) {
        if (status === 'error') {
            if (error === 'Forbidden') {
                Materialize.toast(I18n.t('js.article.model.errors.not_authorized'));
            } else if (error === 'Unprocessable Entity') {
                Materialize.toast(I18n.t('js.article.model.errors.unprocessable'));
            }
        }
    },

    _resetSearch: function () {
        this.lastRequest = {};
        this.hasMore = true;
    },

    _fetchArticles: function (data, callback) {
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
            function (data) {
                callback.bind(this, data)();
            }.bind(this))
            .fail(function (xhr, status, error) {
                this._handleJsonErrors(xhr, status, error);
            }.bind(this));
    },

    onLoadArticles: function (data) {
        this._resetSearch();

        this._fetchArticles(data, function (dataReceived) {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.articleData.hasMore = true;

            this.trigger(this.articleData);

            if (!$.isEmpty(this.paramsFromUrl)) {
                this.paramsFromUrl = {};
            }

            this._saveRequest(data);
        }.bind(this));
    },

    onLoadNextArticles: function (data) {
        if (this.lastRequest.page) {
            this.lastRequest.page += 1;
        } else {
            this.lastRequest.page = 2;
        }

        this._fetchArticles(_.merge(this.lastRequest, data), function (dataReceived) {
            var uniqueArticles = [];
            var uniqueIds = {};

            this.articleData.articles.concat(dataReceived.articles).map(function (article) {
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

    onLoadArticlesByTag: function (data) {
        if(!$.isEmpty(data)) {
            var url = '';

            if (data.tags) {
                url = 'tags=' + data.tags.join(',');
            }
            if (data.relationTags) {
                url = 'relationTags=' + data.relationTags.join(',');
            }

            if($(location).attr('pathname') !== '/' && !/\/users\//i.test($(location).attr('pathname'))) {
                window.location.replace('/?' + url);
            }

            this.onLoadArticles(data);
        }
    },

    onPushArticles: function (article) {
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
            success: function (data) {
                // Add to the current list
                this.articleData.articles.unshift(data.article);
                this.trigger(this.articleData);
            }.bind(this),
            error: function (xhr, status, error) {
                this._handleJsonErrors(xhr, status, error);
            }.bind(this)
        });
    },

    onUpdateArticles: function (article) {
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
            success: function (data) {
                if (fromEditPage && data.article) {
                    window.location.replace("/articles/" + data.article.id);
                } else {
                    // Update the articles
                    var updatedArticleList = [];
                    var updatedArticle = data.article;
                    this.articleData.articles.forEach(function (article, index, articles) {
                        if (updatedArticle.id === article.id) {
                            updatedArticleList.push(updatedArticle);
                        } else {
                            updatedArticleList.push(article);
                        }
                    }.bind(this));
                    this.articleData.articles = updatedArticleList;
                    this.trigger(this.articleData);
                }
            }.bind(this),
            error: function (xhr, status, error) {
                this._handleJsonErrors(xhr, status, error);
            }.bind(this)
        });
    },

    onDeleteArticles: function (article) {
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
            success: function (data) {
                if (showMode && data.id) {
                    window.location.replace("/");
                } else {
                    // Remove the article
                    var updatedArticleList = [];
                    var removedArticleId = data.id;
                    this.articleData.articles.forEach(function (article, index, articles) {
                        if (removedArticleId !== article.id) {
                            updatedArticleList.push(article);
                        }
                    }.bind(this));
                    this.articleData.articles = updatedArticleList;
                    this.trigger(this.articleData);

                    if(data.url) {
                        Materialize.toast(I18n.t('js.article.flash.deletion_successful') + ' ' + '<a href=' + data.url + '>' + I18n.t('js.article.flash.undelete_link')+ '</a>');
                    }
                }
            }.bind(this),
            error: function (xhr, status, error) {
                this._handleJsonErrors(xhr, status, error);
            }.bind(this)
        });
    },

    onSearchArticles: function (data) {
        this._resetSearch();

        if ($.isEmpty(this.paramsFromUrl)) {
            var queryParams = {
                query: data.query,
                tags: data.tags ? data.tags.join(',') : null
            };
            this.saveState(queryParams, {title: I18n.t('js.article.search.url') + ' ' + queryParams.query});
        }

        this._fetchArticles(data, function (dataReceived) {
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
        }.bind(this));
    },

    onAutocompleteArticles: function (data) {
        if (!$.isEmpty(data.autocompleteQuery)) {
            this._fetchArticles(data, function (dataReceived) {
                this.autocompleteValues = dataReceived.articles;
                this.trigger({autocompletion: this.autocompleteValues});
            }.bind(this));
        }
    },

    _filterArticlesByTag: function () {
        if (!$.isEmpty(this.activeTags)) {
            this.articleData.articles.forEach(function (article, index, articles) {
                articles[index].show = true;
                var activeTagsByArticle = article.tags.filter(function (tag) {
                    if (!this.activeTags.hasOwnProperty(tag.id)) {
                        this.activeTags[tag.id] = true
                    }
                    return this.activeTags[tag.id];
                }.bind(this));
                if (activeTagsByArticle.length === 0) {
                    articles[index].show = false;
                }
            }.bind(this));
        }
    },

    onFilterArticlesByTag: function (tagId, activeTag) {
        this.activeTags[tagId] = activeTag;
        this._filterArticlesByTag();
        this.trigger(this.articleData);

        _paq.push(['trackSiteSearch', tagId, 'Tags']);
    },

    onLoadArticleHistory: function (data) {
        if (!$.isEmpty(data.history)) {
            this._fetchArticles(data, function (dataReceived) {
                this.trigger({articleVersions: dataReceived['paper_trail/versions']});
            }.bind(this));
        }
    },

    onRestoreArticle: function (data) {
        if (!$.isEmpty(data.restore)) {
            this._fetchArticles(data, function (dataReceived) {
                this.trigger({articleRestored: dataReceived.article});
            }.bind(this));
        }
    },

    onBookmarkArticle: function (data) {
        if (!$.isEmpty(data.articleId)) {
            var requestParam = {};

            requestParam.article_id = data.articleId;
            var url = this.url + '/' + data.articleId + '/bookmark';

            $.ajax({
                url: url,
                dataType: 'json',
                type: 'POST',
                data: requestParam,
                success: function (data) {
                    return true;
                }.bind(this),
                error: function (xhr, status, error) {
                    this._handleJsonErrors(xhr, status, error);
                }.bind(this)
            });
        }
    }
});

module.exports = ArticleStore;
