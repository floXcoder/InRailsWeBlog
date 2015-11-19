var ArticleTags = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func,
        linkTag: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            onClickTag: null,
            linkTag: null
        };
    },

    _onClickTag: function (tagName, event) {
        event.preventDefault();
        this.props.onClickTag(tagName);
    },

    render: function () {
        var parentTags = _.indexBy(this.props.article.parent_tags, 'id');
        var childTags = _.indexBy(this.props.article.child_tags, 'id');
        var tagList = this.props.article.parent_tags.concat(
            this.props.article.child_tags.concat(
                _.filter(this.props.article.tags, function (tag) {
                    return !parentTags[tag.id] && !childTags[tag.id]
                })
            ));
        var Tags = tagList.map(function (tag) {
            var relationshipClass = '';
            if (parentTags[tag.id]) {
                relationshipClass = 'tag-parent';
            } else if (childTags[tag.id]) {
                relationshipClass = 'tag-child';
            }

            var tagClassNames = "waves-effect waves-light btn-small article-tag " + relationshipClass;

            if(this.props.onClickTag) {
                return (
                    <a key={tag.id}
                       onClick={this._onClickTag.bind(this, tag.name)}
                       className={tagClassNames}>
                        {tag.name}
                    </a>
                );
            } else {
                return (
                    <a key={tag.id}
                       href={"/?tags=" + tag.name}
                       className={tagClassNames}>
                        {tag.name}
                    </a>
                );
            }
        }.bind(this));

        if (Tags.length > 0) {
            return (
                <div>
                    {Tags}
                </div>
            )
        } else {
            return null;
        }
    }
});

module.exports = ArticleTags;
