var ArticleActions = require('../../../actions/articleActions');
var ParentTag = require('./parent');

var IndexTagList = React.createClass({
    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $('.blog-index-tag .collapsible').collapsible();
    },

    componentDidUpdate: function () {
        $('.blog-index-tag .collapsible').collapsible();
    },

    _onTagClick: function (parentTagName, childTagName) {
        var tags = [];
        if (!$utils.isEmpty(childTagName)) {
            tags.push(parentTagName);
            tags.push(childTagName);
            ArticleActions.loadArticles({relationTags: tags});
        } else if (!$utils.isEmpty(parentTagName)) {
            tags.push(parentTagName);
            ArticleActions.loadArticles({tags: tags});
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
                               onTagClick={this._onTagClick} />
                );
            }, this);
        }

        if (!$utils.isEmpty(TagItems)) {
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
