var ArticleActions = require('../actions/articleActions');

var ArticleStore = Reflux.createStore({
    // auto-connects actions with stores
    listenables: [ArticleActions],
    articleData: {},
    activeTags: {},
    autocompleteValues: {},
    url: '/articles',
    lastRequest: {},
    //lastPage: null,

    init: function () {
        this.onLoadArticles({page: 1});
    },

    _resetSearch: function () {
        this.lastRequest = {};
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

        this._fetchArticles(data, function (dataReceived) {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.articleData.newArticles = true;
            this.trigger(this.articleData);
        }.bind(this));
    },

    onLoadNextArticles: function (data) {
        if(this.lastRequest.page) {
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

            // Manage in articles/box
            this.articleData.articles = uniqueArticles;
            this._filterArticlesByTag();
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
                // Update the articles
                var updatedArticleList = [];
                var updatedArticle = data.articles[0];
                this.articleData.articles.forEach(function (article, index, articles) {
                    if(updatedArticle.id === article.id) {
                        updatedArticleList.push(updatedArticle);
                    } else {
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

    _filterArticlesByTag: function () {
        if (!$utils.isEmpty(this.activeTags)) {
            this.articleData.articles.forEach(function (article, index, articles) {
                var activeTagsByArticle = article.tags.filter(function (tag) {
                    if(!this.activeTags.hasOwnProperty(tag.id)) {
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
    },

    onSearchArticles: function (data) {
        this._resetSearch();

        //this.searchOptions = data.searchOptions;

        this._fetchArticles(data, function (dataReceived) {
            // Manage in articles/box
            this.articleData = dataReceived;
            this.trigger(this.articleData);
        }.bind(this));
    },

    onAutocompleteArticles: function (data) {
        if(!$utils.isEmpty(data.autocompleteQuery)) {
            this._fetchArticles(data, function (dataReceived) {
                this.autocompleteValues = dataReceived;
                this.trigger({autocompletion: this.autocompleteValues});
            }.bind(this));
        }
    }
});

module.exports = ArticleStore;
