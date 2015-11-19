var TagList = React.createClass({
    propTypes: {
        tags: React.PropTypes.array.isRequired,
        onClickTag: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            classByTag: {}
        };
    },

    _onClickTag: function (tagId, event) {
        event.preventDefault();

        var classByTag = this.state.classByTag;
        classByTag[tagId] = !classByTag[tagId];
        this.setState({classByTag: classByTag});

        this.props.onClickTag(tagId, !classByTag[tagId]);
    },

    render: function () {
        var ArticleNodes = this.props.tags.map(function (tag) {
            var tagClass = 'waves-light btn-small article-tag';

            if(this.state.classByTag[tag.id]) {
                tagClass += ' tag-inactive';
            } else {
                tagClass += ' tag-active';
            }

            return (
                <div key={tag.id} className={tagClass} onClick={this._onClickTag.bind(this, tag.id)}>
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
