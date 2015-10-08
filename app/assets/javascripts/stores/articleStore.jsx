var ArticleActions = require('../actions/articleActions');

var ArticleStore = Reflux.createStore({
    // auto-connects actions with stores
    listenables: [ArticleActions],
    articleList: {},
    activeTags: {},
    url: '/articles',

    init: function () {
        this.onLoadArticles({page: 1});
    },

    _fetchArticles: function (data, callback) {
        var requestParam = {};

        if (data) {
            if (data.tags) {
                requestParam.tag_ids = data.tags;
            }

            if (data.page) {
                requestParam.page = data.page;
            }
        }

        jQuery.getJSON(
            this.url,
            requestParam,
            function (data) {
                callback.bind(this, data)();
            }.bind(this));
    },

    onLoadArticles: function (dataSent) {
        this._fetchArticles(dataSent, function (dataReceived) {
            this.articleList = dataReceived;
            // Responsible for updating all subscribed component's states.
            this.trigger(this.articleList);
        }.bind(this));
    },

    onLoadMoreArticles: function (dataSent) {
        this._fetchArticles(dataSent, function (dataReceived) {
            var uniqueArticles = [];
            var uniqueIds = {};

            this.articleList.articles.concat(dataReceived.articles).map(function (article) {
                if (!uniqueIds[article.id]) {
                    uniqueArticles.push(article);
                    uniqueIds[article.id] = article;
                }
            });

            this.articleList.articles = uniqueArticles;

            this._filterActiveTags();

            this.trigger(this.articleList);
        });
    },

    onPushArticles: function (article) {
        var requestParam = {};

        if (article) {
            requestParam.articles = article;
        }

        $.ajax({
            url: this.url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
                // Add to the current list
                this.articleList.articles.unshift(data.articles[0]);
                if (data.tags) {
                    this.articleList.tags.unshift(data.tags[0]);
                }
                this.trigger(this.articleList);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    _filterActiveTags: function () {
        if (!$utils.isEmpty(this.activeTags)) {
            this.articleList.articles.forEach(function (article, index, articles) {
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
        this._filterActiveTags();
        this.trigger(this.articleList);
    }
});

module.exports = ArticleStore;
