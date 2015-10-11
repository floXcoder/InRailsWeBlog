var AssociatedTagList = require('./associatedList');
var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');

var Spinner = require('../../components/materialize/spinner');

var AssociatedTagBox = React.createClass({
    // With specifying mixins we say that we'd like to connect this component's state with the ImageStore.
    // What this means is that whenever the store reacts to the action the component's state will be updated.
    mixins: [Reflux.listenTo(ArticleStore, 'onArticleChange')],

    getInitialState: function () {
        return {
            tags: null,
            isLoading: true
        };
    },

    onArticleChange: function (articleStore) {
        if(!$utils.isEmpty(articleStore.tags)) {
            this.setState({
                tags: articleStore.tags,
                isLoading: false
            });
        }
    },

    _onTagClick: function (tagId, activeTag) {
        ArticleActions.filterArticlesByTag(tagId, activeTag);
    },

    _displayTagsIfExist: function () {
        if (this.state.tags) {
            return (
                <AssociatedTagList tags={this.state.tags} onTagClick={this._onTagClick}/>
            );
        }
    },

    render: function () {
        return (
            <div className="card-panel">
                <div className="blog-tag-box center-align">
                    <h4>
                        {I18n.t('js.tag.associated')}
                    </h4>
                    { this._displayTagsIfExist() }
                    <div className={this.state.isLoading ? 'center': 'hide'}>
                        <Spinner />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AssociatedTagBox;
