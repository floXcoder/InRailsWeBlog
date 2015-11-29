'use strict';

var classNames = require('classnames');

var TagList = React.createClass({
    propTypes: {
        tags: React.PropTypes.array.isRequired,
        onClickTag: React.PropTypes.func.isRequired
    },

    getInitialState () {
        return {
            classByTag: {}
        };
    },

    _handleTagClick (tagId, event) {
        event.preventDefault();

        let classByTag = this.state.classByTag;
        classByTag[tagId] = !classByTag[tagId];
        this.setState({classByTag: classByTag});

        this.props.onClickTag(tagId, !classByTag[tagId]);
    },

    render () {
        var ArticleNodes = this.props.tags.map(function (tag) {
            let tagClasses = classNames(
                'waves-light', 'btn-small', 'article-tag',
                {
                    'tag-inactive': this.state.classByTag[tag.id],
                    'tag-active': !this.state.classByTag[tag.id]
                }
            );

            return (
                <div key={tag.id}
                     className={tagClasses}
                     onClick={this._handleTagClick.bind(this, tag.id)}>
                    {tag.name}
                </div>
            );
        }.bind(this));

        return (
            <div className="blog-associated-tag">
                {ArticleNodes}
            </div>
        );
    }
});

module.exports = TagList;
