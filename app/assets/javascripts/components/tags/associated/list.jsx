'use strict';

const classNames = require('classnames');

var AssociatedTagList = React.createClass({
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
        return (
            <div className="blog-associated-tag">
                {
                    this.props.tags.map((tag, i) =>
                        <div key={i}
                             className={
                             classNames(
                                'waves-light', 'btn-small', 'article-tag',
                                {
                                    'tag-inactive': this.state.classByTag[tag.id],
                                    'tag-active': !this.state.classByTag[tag.id]
                                })
                             }
                             onClick={this._handleTagClick.bind(this, tag.id)}>
                            {tag.name}
                        </div>
                    )
                }
            </div>
        );
    }
});

module.exports = AssociatedTagList;
