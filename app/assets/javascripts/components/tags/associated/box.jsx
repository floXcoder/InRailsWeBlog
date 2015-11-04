var AssociatedTagList = require('./list');
var ArticleActions = require('../../../actions/articleActions');
var ArticleStore = require('../../../stores/articleStore');

var Spinner = require('../../../components/materialize/spinner');

var AssociatedTagBox = React.createClass({
    // With specifying mixins we say that we'd like to connect this component's state with the ImageStore.
    // What this means is that whenever the store reacts to the action the component's state will be updated.
    mixins: [Reflux.listenTo(ArticleStore, 'onArticleChange')],

    getInitialState: function () {
        return {
            associatedTags: null,
            isLoading: true
        };
    },

    onArticleChange: function (articleStore) {
        if(!$utils.isEmpty(articleStore.articles)) {
            var associatedTags = [];

            articleStore.articles.forEach(function (article) {
                if(!$utils.isEmpty(article.tags)) {
                    associatedTags = associatedTags.concat(article.tags);
                }
            });

            associatedTags = _.uniq(associatedTags, function(tag) {
                return tag.id;
            });

            this.setState({
                associatedTags: associatedTags,
                isLoading: false
            });
        }
    },

    _onTagClick: function (tagId, activeTag) {
        ArticleActions.filterArticlesByTag(tagId, activeTag);
    },

    _displayTagsIfExist: function () {
        if (this.state.associatedTags) {
            return (
                <AssociatedTagList tags={this.state.associatedTags} onTagClick={this._onTagClick}/>
            );
        }
    },

    render: function () {
        return (
            <div className="blog-associated-tag center-align">
                { this._displayTagsIfExist() }
                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner />
                </div>
            </div>
        );
    }
});

module.exports = AssociatedTagBox;
