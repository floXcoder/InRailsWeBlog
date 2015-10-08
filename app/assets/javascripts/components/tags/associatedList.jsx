var TagList = React.createClass({
    getInitialState: function() {
        return {
            classByTag: {}
        };
    },

    _onTagClick: function (tagId, event) {
        event.preventDefault();

        var classByTag = this.state.classByTag;
        if(classByTag[tagId]) {
            classByTag[tagId] = false;
        } else {
            classByTag[tagId] = true;
        }
        this.setState({classByTag: classByTag});

        this.props.onTagClick(tagId, !classByTag[tagId]);
    },

    render: function () {
        var ArticleNodes = this.props.tags.map(function (tag) {
            var tagClass = 'chip';

            if(this.state.classByTag[tag.id]) {
                tagClass += ' tag-inactive';
            } else {
                tagClass += ' tag-active';
            }

            return (
                <div key={tag.id} className={tagClass} onClick={this._onTagClick.bind(this, tag.id)}>
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
