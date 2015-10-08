var TagActions = require('../actions/tagActions');

var TagStore = Reflux.createStore({
    // auto-connects actions with stores
    listenables: [TagActions],
    tagList: {},
    url: '/tags',

    init: function () {
        this.onFetchTags();
    },

    onFetchTags: function () {
        var requestParam = {};

        //if (data) {
        //    if (data.tags) {
        //        requestParam.tag_ids = data.tags;
        //    }
        //}

        jQuery.getJSON(
            this.url,
            requestParam,
            function (data) {
                this.tagList = data.tags;
                this.trigger(this.tagList);
            }.bind(this));
    }

    //onPushArticles: function (article) {
    //    $.ajax({
    //        url: this.url,
    //        dataType: 'json',
    //        type: 'POST',
    //        data: {articles: article},
    //        success: function (data) {
    //            // Add to the current list
    //            this.articleList.articles.unshift(data.articles[0]);
    //            if (data.tags) {
    //                this.articleList.tags.unshift(data.tags[0]);
    //            }
    //            this.trigger(this.articleList);
    //        }.bind(this),
    //        error: function (xhr, status, err) {
    //            console.error(this.url, status, err.toString());
    //        }.bind(this)
    //    });
    //}
});

module.exports = TagStore;
