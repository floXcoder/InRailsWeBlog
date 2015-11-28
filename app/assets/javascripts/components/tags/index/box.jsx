'use strict';

var classNames = require('classnames');

var IndexTagList = require('./list');
var SearchBar = require('./search');
var TagStore = require('../../../stores/tagStore');
var Spinner = require('../../../components/materialize/spinner');
var fuzzy = require('fuzzy');

var IndexTagBox = React.createClass({
    propTypes: {
        hasMore: React.PropTypes.bool
    },

    mixins: [
        Reflux.listenTo(TagStore, 'onLoadTag')
    ],

    getDefaultProps () {
        return {
            hasMore: false
        };
    },

    getInitialState () {
        return {
            tags: {},
            filteredTags: {},
            isLoading: true,
            filterText: ''
        };
    },

    onLoadTag (tagStore) {
        this.setState({
            tags: _.indexBy(tagStore, 'id'),
            filteredTags: _.indexBy(tagStore, 'id'),
            isLoading: false
        });
    },

    _handleUserInput (filterText) {
        let filteredTags = {};

        let tagsArray = _.toArray(this.state.tags);
        fuzzy.filter(filterText, tagsArray, {
            extract (tag) {
                return tag.name;
            }
        }).forEach(function (tag) {
            let tagId = tagsArray[tag.index].id;
            filteredTags[tagId] = this.state.tags[tagId];
        }.bind(this));

        this.setState({
            filterText: filterText,
            filteredTags: filteredTags
        });
    },

    render () {
        let loaderClass = classNames(
            {
                'center': this.props.hasMore,
                'hide': !this.props.hasMore
            }
        );

        return (
            <div className="blog-index-tag">
                <SearchBar filterText={this.state.filterText}
                           onUserInput={this._handleUserInput} />

                <IndexTagList tags={this.state.tags}
                              filteredTags={this.state.filteredTags}
                              filterText={this.state.filterText} />

                <div className={loaderClass}>
                    <Spinner />
                </div>
            </div>
        );
    }

});

module.exports = IndexTagBox;
