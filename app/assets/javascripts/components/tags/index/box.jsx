'use strict';

var classNames = require('classnames');

var IndexTagList = require('./list');
var SearchBar = require('../../theme/search-bar');
var TagStore = require('../../../stores/tagStore');
var Spinner = require('../../../components/materialize/spinner');

var Filtering = require('../../../modules/filter');

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

    onLoadTag (tagData) {
        this.setState({
            tags: _.indexBy(tagData, 'id'),
            filteredTags: _.indexBy(tagData, 'id'),
            isLoading: false
        });
    },

    _handleUserInput (filterText) {
        let filteredTags = Filtering.filterObjectOfObject(this.state.tags, 'name', filterText);

        this.setState({
            filterText: filterText,
            filteredUsers: filteredTags
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
                <SearchBar label={I18n.t('js.tag.filter')}
                           filterText={this.state.filterText}
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
