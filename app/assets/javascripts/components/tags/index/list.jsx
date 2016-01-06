'use strict';

var ArticleActions = require('../../../actions/articleActions');
var ParentTag = require('./parent');

var TagAction = require('../../../actions/tagActions');
var TagStore = require('../../../stores/tagStore');

var IndexTagList = React.createClass({
    propTypes: {
        tags: React.PropTypes.object.isRequired,
        filteredTags: React.PropTypes.object.isRequired,
        filterText: React.PropTypes.string.isRequired
    },

    getInitialState () {
        return {};
    },

    componentDidMount () {
        $('.blog-index-tag .collapsible').collapsible({
            accordion: false
        });
    },

    componentDidUpdate () {
        $('.blog-index-tag .collapsible').collapsible({
            accordion: false
        });
    },

    _handleTagClick (tagId, parentTagName, childTagName) {
        TagStore.onTrackClick(tagId);

        let tags = [];
        if (!$.isEmpty(childTagName)) {
            tags.push(parentTagName);
            tags.push(childTagName);
            ArticleActions.loadArticlesByTag({relationTags: tags});
        } else if (!$.isEmpty(parentTagName)) {
            tags.push(parentTagName);
            ArticleActions.loadArticlesByTag({tags: tags});
        }

        // Close sidebar if no children
        TagAction.closeSidebar();

        return true;
    },

    render () {
        var TagItems = null;

        if (this.props.filteredTags) {
            let parentFilteredTags = [];
            _.map(_.toArray(this.props.tags), function (tag) {
                if (this.props.filteredTags[tag.id]
                    || _.intersection(_.pluck(this.props.filteredTags, 'id'), _.pluck(tag.children, 'id')).length > 0) {
                    parentFilteredTags.push(tag);
                }
            }, this);

            TagItems = _.map(parentFilteredTags, function (tag) {
                return (
                    <ParentTag key={tag.id}
                               tag={tag}
                               filteredTags={this.props.filteredTags}
                               textFiltered={this.props.filterText !== ''}
                               onClickTag={this._handleTagClick}/>
                );
            }, this);
        }

        if (!$.isEmpty(TagItems)) {
            return (
                <ul className="collapsible"
                    data-collapsible="expandable">
                    {TagItems}
                </ul>
            );
        }
        else {
            return (
                <div>
                    {I18n.t('js.tag.no_results') + ' ' + this.props.filterText}
                </div>
            );
        }
    }
});

module.exports = IndexTagList;
