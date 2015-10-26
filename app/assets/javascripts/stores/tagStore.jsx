var TagActions = require('../actions/tagActions');

var TagStore = Reflux.createStore({
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

});

module.exports = TagStore;
