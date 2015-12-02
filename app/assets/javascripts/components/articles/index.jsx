'use strict';

var Spinner = require('../../components/materialize/spinner');

var UserStore = require('../../stores/userStore');

var ArticleStore = require('../../stores/articleStore');
var ArticleListDisplay = require('./display/list');
var ArticleNone = require('../../components/articles/display/none');

var ArticleIndex = React.createClass({
    propTypes: {
        currentUserId: React.PropTypes.number
    },

    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getDefaultProps () {
        return {
            currentUserId: null
        };
    },

    getInitialState () {
        return {
            articles: null,
            isLoading: true,
            hasMore: true,
            articleDisplayMode: 'card',
            highlightResults: true
        };
    },

    componentDidMount () {
        this._activateTooltip();
    },

    componentDidUpdate () {
        this._activateTooltip();
    },

    _activateTooltip () {
        let $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(function () {
            $currentElement.find('.tooltipped').tooltip({
                position: "bottom",
                delay: 50
            });
        });
    },

    onPreferenceChange (userStore) {
        let newState = {};

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

    onArticleChange (articleStore) {
        let newState = {};

        if (typeof(articleStore.articles) !== 'undefined') {
            newState.articles = articleStore.articles;
            newState.isLoading = false;
        }

        newState.hasMore = !!articleStore.hasMore;

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _renderArticleList () {
        if (this.state.articles && this.state.articles.length > 0) {
            return (
                <ArticleListDisplay
                    ref="articlesList"
                    currentUserId={this.props.currentUserId}
                    articles={this.state.articles}
                    hasMore={this.state.hasMore}
                    highlightResults={this.state.highlightResults}
                    articleDisplayMode={this.state.articleDisplayMode}/>
            );
        } else if (this.state.articles && this.state.articles.length === 0) {
            return (
                <ArticleNone/>
            );
        } else {
            return null;
        }
    },

    render () {
        return (
            <div className="blog-article-box">
                <div className={this.state.isLoading ? 'center': 'hide' + ' margin-top-20'}>
                    <Spinner size='big'/>
                </div>
                {this._renderArticleList()}
            </div>
        );
    }
});

module.exports = ArticleIndex;
