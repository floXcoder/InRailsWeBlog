'use strict';

var classNames = require('classnames');

var ArticleTags = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func,
        linkTag: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            onClickTag: null,
            linkTag: null
        };
    },

    _handleTagClick (tagName, event) {
        event.preventDefault();
        this.props.onClickTag(tagName);
    },

    render () {
        let parentTags = _.indexBy(this.props.article.parent_tags, 'id');
        let childTags = _.indexBy(this.props.article.child_tags, 'id');
        let tagList = this.props.article.parent_tags.concat(
            this.props.article.child_tags.concat(
                _.filter(this.props.article.tags, function (tag) {
                    return !parentTags[tag.id] && !childTags[tag.id]
                })
            ));
        let Tags = tagList.map(function (tag) {
            let tagClasses = classNames(
                'waves-effect', 'waves-light', 'btn-small', 'article-tag',
                {
                    'tag-parent': parentTags[tag.id],
                    'tag-child': childTags[tag.id]
                }
            );

            if (this.props.onClickTag) {
                return (
                    <a key={tag.id}
                       onClick={this._handleTagClick.bind(this, tag.name)}
                       className={tagClasses}>
                        {tag.name}
                    </a>
                );
            } else {
                return (
                    <a key={tag.id}
                       href={"/?tags=" + tag.name}
                       className={tagClasses}>
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
