var Spinner = require('../../components/materialize/spinner');

var UserStore = require('../../stores/userStore');

var ArticleStore = require('../../stores/articleStore');
var ArticleActions = require('../../actions/articleActions');
var ArticleListDisplay = require('./display/list');
var ArticleNone = require('../../components/articles/display/none');

var ArticleIndex = React.createClass({
    // With specifying mixins we say that we'd like to connect this component's state with the ArticleStore.
    // What this means is that whenever the store reacts to the action the component's state will be updated.
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    propTypes: {
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

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

    _activateTooltip: function () {
        var $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(function () {
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
            newState.highlightResults = userStore.search.search_highlight;
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
                <ArticleListDisplay
                    ref="articlesList"
                    userId={this.props.userId}
                    articles={this.state.articles}
                    hasMore={this.state.hasMore}
                    highlightResults={this.state.highlightResults}
                    articleDisplayMode={this.state.articleDisplayMode}/>
            );
        } else if (this.state.articles && this.state.articles.length === 0) {
            return (
                <ArticleNone/>
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

module.exports = ArticleIndex;
