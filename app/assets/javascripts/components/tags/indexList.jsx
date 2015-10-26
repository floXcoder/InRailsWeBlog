var ArticleActions = require('../../actions/articleActions');

var ChildTag = React.createClass({
    _onTagClick: function (tagName) {
        this.props.onTagClick(this.props.parentTag.name, tagName);
        return true;
    },

    render: function () {
        return (
            <li className="tag-child">
                <a onClick={this._onTagClick.bind(this, this.props.tag.name)}>
                    <i className="material-icons">label</i>
                    {this.props.tag.name}
                </a>
            </li>
        );
    }
});

var ParentTag = React.createClass({

    _onTagClick: function (parentTagName, childTagName, event) {
        if(!event || (event.target.nodeName !== 'I' && !_.includes(event.target.classList, 'tag-dropdown'))) {
            this.props.onTagClick(parentTagName, childTagName);
        }
        return true;
    },

    _renderArrow: function () {
        if (this.props.tag.children.length > 0) {
            return (
                <i className="material-icons tag-dropdown">
                    arrow_drop_down
                </i>
            );
        }
    },

    _renderChildrenTag: function () {
        return _.map(this.props.tag.children, function (tag) {
            var childTag = this.props.filteredTags[tag.id];
            if (childTag) {
                return (
                    <ChildTag key={childTag.id + '-' + tag.id}
                              tag={childTag}
                              parentTag={this.props.tag}
                              onTagClick={this._onTagClick} />
                );
            }
        }, this);
    },

    render: function () {
        return (
            <li>
                <a className={(this.props.textFiltered ? 'active ' : '') + 'collapsible-header tag-parent'}
                   onClick={this._onTagClick.bind(this, this.props.tag.name, null)} >
                    <i className="material-icons tag-parent-icon">label</i>
                    {this.props.tag.name}
                    {this._renderArrow()}
                </a>

                <div className="collapsible-body tag-children">
                    <ul>
                        {this._renderChildrenTag()}
                    </ul>
                </div>
            </li>
        );
    }
});

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
        if(!$utils.isEmpty(childTagName)) {
            tags.push(parentTagName);
            tags.push(childTagName);
            ArticleActions.loadArticles({relationTags: tags});
        } else if(!$utils.isEmpty(parentTagName)) {
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
