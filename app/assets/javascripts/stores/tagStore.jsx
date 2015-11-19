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

        jQuery.getJSON(
            this.url,
            requestParam,
            function (dataReceived) {
                this.tagList = dataReceived.tags;
                this.trigger(this.tagList);
            }.bind(this));
    }
});

module.exports = TagStore;
