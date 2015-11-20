"use strict";

var IndexTagList = require('./list');
var SearchBar = require('./search');
var TagStore = require('../../../stores/tagStore');
var Spinner = require('../../../components/materialize/spinner');
var fuzzy = require('fuzzy');

var IndexTagBox = React.createClass({
    mixins: [Reflux.listenTo(TagStore, 'onLoadTag')],

    getInitialState: function () {
        return {
            tags: {},
            filteredTags: {},
            isLoading: true,
            filterText: ''
        };
    },

    onLoadTag(tagStore) {
        this.setState({
            tags: _.indexBy(tagStore, 'id'),
            filteredTags: _.indexBy(tagStore, 'id'),
            isLoading: false
        });
    },

    handleUserInput: function (filterText) {
        var filteredTags = {};

        var tagsArray = _.toArray(this.state.tags);
        fuzzy.filter(filterText, tagsArray, {
            extract: function (tag) {
                return tag.name;
            }
        }).forEach(function (tag) {
            var tagId = tagsArray[tag.index].id;
            filteredTags[tagId] = this.state.tags[tagId];
        }.bind(this));

        this.setState({
            filterText: filterText,
            filteredTags: filteredTags
        });
    },

    render: function () {
        return (
            <div className="blog-index-tag">
                <SearchBar filterText={this.state.filterText}
                           onUserInput={this.handleUserInput} />

                <IndexTagList tags={this.state.tags}
                              filteredTags={this.state.filteredTags}
                              filterText={this.state.filterText} />

                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner />
                </div>
            </div>
        );
    }

});

module.exports = IndexTagBox;
