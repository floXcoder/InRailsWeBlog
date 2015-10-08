var ArticleActions = require('../../actions/articleActions');

var IndexTagList = React.createClass({
    _displayArticleWithTag: function (tagId, event) {
        ArticleActions.loadArticles({tags: tagId});
    },

    componentDidMount: function() {
        $('.collapsible').collapsible({
            accordion : true
        });
    },

    render: function () {
        var ArticleNodes = this.props.tags.map(function (tag) {
            return (
                <li key={tag.id} className="collection-item">
                    <div>
                        {'#' + tag.name}
                        <a href="#!" className="secondary-content"
                           onClick={this._displayArticleWithTag.bind(this, tag.id)}>
                            <i className="material-icons">send</i>
                        </a>
                    </div>
                </li>
            );
        }, this);

        return (
            <ul data-collapsible="accordion" className="collapsible">
                <li>
                    <div className="collapsible-header"><i className="material-icons">bookmark_border</i>
                        <h4 className="collection-header">
                            {I18n.t('js.tag.list')}
                        </h4>
                    </div>
                    <div className="collapsible-body">
                        <ul className="collection">
                            {ArticleNodes}
                        </ul>
                    </div>
                </li>
            </ul>
        );
    }
});

module.exports = IndexTagList;
