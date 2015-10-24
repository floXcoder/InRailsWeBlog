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
    lastRequest: {},
    hasMore: true,
    paramsFromUrl: {},

    init: function () {
        this.bindToBrowserhistory();
    },

    deserializeParams: function (state) {
        var tags = [];
        if (!$utils.isEmpty(state.tags)) {
            state.tags.split(',').forEach(function (tag) {
                tags.push(tag);
            });
        }

        if(state.query) {
            return {
                query: state.query,
                tags: tags
            };
        } else if (state.tags) {
            return {
                tags: tags
            };
        }
    },

    handleParams: function (state) {
        if (state) {
            if (state.query) {
                this.paramsFromUrl = {query: state.query, tags: state.tags};
                this.onSearchArticles({query: state.query, tags: state.tags});
            } else if (state.tags) {
                this.paramsFromUrl = {tags: state.tags};
                this.onLoadArticles({tags: state.tags});
            }
        } else {
            this.onLoadArticles({page: 1});
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
            if (data.tags) {
                requestParam.tags = data.tags;
            }

            if (data.page) {
                requestParam.page = data.page;
            } else {
                requestParam.page = 1;
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

        this.lastRequest = data;

        jQuery.getJSON(
            url,
            requestParam,
            function (data) {
                callback.bind(this, data)();
            }.bind(this));
    },

    onLoadArticles: function (data) {
        this._resetSearch();

        if ($utils.isEmpty(this.paramsFromUrl) && data.tags) {
            var tagParams = {
                tags: data.tags.join(',')
            };
            this.saveState(tagParams, {title: I18n.t('js.article.tag.url') + ' ' + tagParams.tags});
        }

        this._fetchArticles(data, function (dataReceived) {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.articleData.hasMore = true;

            this.trigger(this.articleData);

            if (!$utils.isEmpty(this.paramsFromUrl)) {
                this.paramsFromUrl = {};
            }

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
            }

            // Manage in articles/box
            this.articleData.articles = uniqueArticles;
            this.articleData.hasMore = this.hasMore;
            this.trigger(this.articleData);
        });
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
                this.articleData.articles.unshift(data.articles[0]);
                if (data.tags) {
                    this.articleData.tags.unshift(data.tags[0]);
                }
                this.trigger(this.articleData);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
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
                if(fromEditPage && data.articles[0]) {
                    window.location.replace("/articles/" + data.articles[0].id);
                } else {
                    // Update the articles
                    var updatedArticleList = [];
                    var updatedArticle = data.articles[0];
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
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    onDeleteArticles: function (article) {
        var requestParam = {};
        var url = this.url;

        if (article && article.id) {
            url += '/' + article.id;
            requestParam._method = 'delete';
        } else {
            return;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
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
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    onSearchArticles: function (data) {
        this._resetSearch();

        if ($utils.isEmpty(this.paramsFromUrl)) {
            var queryParams = {
                query: data.query,
                tags: data.tags ? data.tags.join(',') : null
            };
            this.saveState(queryParams, {title: I18n.t('js.article.search.url') + ' ' + queryParams.query});
        }

        this._fetchArticles(data, function (dataReceived) {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.articleData.hasMore = true;

            if (!$utils.isEmpty(this.paramsFromUrl)) {
                this.articleData.paramsFromUrl = this.paramsFromUrl;
            }
            this.trigger(this.articleData);

            if (!$utils.isEmpty(this.paramsFromUrl)) {
                delete this.articleData.paramsFromUrl;
                this.paramsFromUrl = {};
            }
        }.bind(this));
    },

    onAutocompleteArticles: function (data) {
        if (!$utils.isEmpty(data.autocompleteQuery)) {
            this._fetchArticles(data, function (dataReceived) {
                this.autocompleteValues = dataReceived;
                this.trigger({autocompletion: this.autocompleteValues});
            }.bind(this));
        }
    }

    //_filterArticlesByTag: function () {
    //    if (!$utils.isEmpty(this.activeTags)) {
    //        this.articleData.articles.forEach(function (article, index, articles) {
    //            var activeTagsByArticle = article.tags.filter(function (tag) {
    //                if(!this.activeTags.hasOwnProperty(tag.id)) {
    //                    this.activeTags[tag.id] = true
    //                }
    //                return this.activeTags[tag.id];
    //            }.bind(this));
    //            if (activeTagsByArticle.length === 0) {
    //                articles[index].show = false;
    //            }
    //        }.bind(this));
    //    }
    //},
    //
    //onFilterArticlesByTag: function (tagId, activeTag) {
    //    this.activeTags[tagId] = activeTag;
    //    this._filterArticlesByTag();
    //    this.trigger(this.articleData);
    //},
});

module.exports = ArticleStore;
