var ArticleActions = require('../../../actions/articleActions');
var ParentTag = require('./parent');

var IndexTagList = React.createClass({
    propTypes: {
        filteredTags: React.PropTypes.object.isRequired,
        filterText: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $('.blog-index-tag .collapsible').collapsible();
    },

    componentDidUpdate: function () {
        $('.blog-index-tag .collapsible').collapsible();
    },

    _onClickTag: function (parentTagName, childTagName) {
        var tags = [];
        if (!$.isEmpty(childTagName)) {
            tags.push(parentTagName);
            tags.push(childTagName);
            ArticleActions.loadArticlesByTag({relationTags: tags});
        } else if (!$.isEmpty(parentTagName)) {
            tags.push(parentTagName);
            ArticleActions.loadArticlesByTag({tags: tags});
        }
        return true;
    },

    render: function () {
        var TagItems = null;

        if (this.props.filteredTags) {
            var parentFilteredTags = [];
            _.map(_.toArray(this.props.tags), function (tag) {
                if (this.props.filteredTags[tag.id] || _.intersection(_.pluck(this.props.filteredTags, 'id'), _.pluck(tag.children, 'id')).length > 0) {
                    parentFilteredTags.push(tag);
                }
            }, this);

            TagItems = _.map(parentFilteredTags, function (tag) {
                return (
                    <ParentTag key={tag.id}
                               tag={tag}
                               filteredTags={this.props.filteredTags}
                               textFiltered={this.props.filterText !== ''}
                               onClickTag={this._onClickTag} />
                );
            }, this);
        }

        if (!$.isEmpty(TagItems)) {
            return (
                <ul className="collapsible collapsible-accordion" data-collapsible="expandable">
                    {TagItems}
                </ul>
            );
        }
        else {
            return (
                <div>
                    No tags found for {this.props.filterText}
                </div>
            );
        }
    }
});

module.exports = IndexTagList;
