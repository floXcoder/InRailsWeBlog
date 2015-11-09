var ArticleStore = require('../../stores/articleStore');
var ArticleActions = require('../../actions/articleActions');
var UserStore = require('../../stores/userStore');
var ArticleList = require('./list');
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
            articleDisplayMode: 'card',
            highlightResults: true
        };
    },

    componentDidMount: function () {
        this._activateTooltip();
    },

    componentDidUpdate: function () {
        this._activateTooltip();
    },

    _activateTooltip: function() {
        var $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(function(){
            $currentElement.find('.tooltipped').tooltip({
                position: "bottom",
                delay: 50
            });
        });
    },

    onPreferenceChange: function (userStore) {
        var newState = {};

        if (!$.isEmpty(userStore.preferences) && userStore.preferences.article_display) {
            newState.articleDisplayMode = userStore.preferences.article_display;
        }

        if (!$.isEmpty(userStore.search) && userStore.search.search_highlight) {
            newState.highlightResults = (userStore.search.search_highlight !== 'false');
        }

        if (!$.isEmpty(newState)) {
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

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _displayListIfArticles: function () {
        if (this.state.articles && this.state.articles.length > 0) {
            return (
                <ArticleList
                    ref="articlesList"
                    userId={this.props.userId}
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
                <div className={this.state.isLoading ? 'center': 'hide' + ' margin-top-20'}>
                    <Spinner size='big'/>
                </div>
                { this._displayListIfArticles() }
            </div>
        );
    }
});

module.exports = ArticleBox;
