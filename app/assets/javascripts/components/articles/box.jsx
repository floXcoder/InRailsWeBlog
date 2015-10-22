var ArticleForm = require('./form');
var ArticleList = require('./list');
var ArticleStore = require('../../stores/articleStore');
var UserStore = require('../../stores/userStore');

var Spinner = require('../../components/materialize/spinner');

var ArticleBox = React.createClass({
    // With specifying mixins we say that we'd like to connect this component's state with the ArticleStore.
    // What this means is that whenever the store reacts to the action the component's state will be updated.
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getInitialState: function () {
        return {
            articles: null,
            isLoading: true,
            hasMore: true,
            articleDisplayMode: 'inline',
            highlightResults: true
        };
    },

    onPreferenceChange: function (userStore) {
        var newState = {};

        if (!$utils.isEmpty(userStore.preferences) && userStore.preferences.article_display) {
            newState.articleDisplayMode = userStore.preferences.article_display;
        }

        if (!$utils.isEmpty(userStore.search) && userStore.search.search_highlight) {
            newState.highlightResults = (userStore.search.search_highlight !== 'false');
        }

        if (!$utils.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    onArticleChange: function (articleStore) {
        var newState = {};

        if (typeof(articleStore.articles) !== 'undefined') {
            newState.articles = articleStore.articles;
            newState.isLoading = false;
        }

        newState.hasMore = !!articleStore.hasMore;

        if (!$utils.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _displayFormIfUser: function () {
        if (this.props.userConnected) {
            return (
                <ArticleForm/>
            );
        }
    },

    _displayListIfArticles: function () {
        if (this.state.articles && this.state.articles.length > 0) {
            return (
                <ArticleList
                    ref="articlesList"
                    userConnected={this.props.userConnected}
                    articles={this.state.articles}
                    hasMore={this.state.hasMore}
                    highlightResults={this.state.highlightResults}
                    articleDisplayMode={this.state.articleDisplayMode}
                    />
            );
        } else if (this.state.articles && this.state.articles.length === 0) {
            return (
                <div className="row">
                    <div className="col s6 offset-s3">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">
                                    {I18n.t('js.article.search.no_results.title')}
                                </span>

                                <p>
                                    {I18n.t('js.article.search.no_results.content')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    },

    render: function () {
        return (
            <div className="blog-article-box">
                <div className="margin-bottom-20"/>
                { this._displayFormIfUser() }
                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner size='big'/>
                </div>
                { this._displayListIfArticles() }
            </div>
        );
    }
});

module.exports = ArticleBox;
