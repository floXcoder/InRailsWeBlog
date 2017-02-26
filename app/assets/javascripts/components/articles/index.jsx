'use strict';

const Spinner = require('../../components/materialize/spinner');

const UserStore = require('../../stores/userStore');

const ArticleActions = require('../../actions/articleActions');
const ArticleStore = require('../../stores/articleStore');
const ArticleListDisplay = require('./display/list');
const ArticleNone = require('../../components/articles/display/none');

var ArticleIndex = React.createClass({
    propTypes: {
        // Populate by react-router
        params: React.PropTypes.object
    },

    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        // Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getDefaultProps () {
        return {
            params: {}
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
        ArticleActions.loadArticles(this.props.params);

        this._activateTooltip();
    },

    componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props.params, nextProps.params)) {
            ArticleActions.loadArticles(nextProps.params);
        }
    },

    componentDidUpdate () {
        this._activateTooltip();
    },

    _activateTooltip () {
        let $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(() => {
            $currentElement.find('.tooltipped').tooltip({
                position: "bottom",
                delay: 50
            });
        });
    },

    onPreferenceChange (userData) {
        let newState = {};

        if (!$.isEmpty(userData.settings) && userData.settings.article_display) {
            newState.articleDisplayMode = userData.settings.article_display;
        }

        if (!$.isEmpty(userData.search) && userData.search.search_highlight) {
            newState.highlightResults = userData.search.search_highlight;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    onArticleChange (articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (articleData.type === 'loadArticles') {
            newState.articles = articleData.articles;
            newState.isLoading = false;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    render () {
        return (
            <div className="blog-article-box">
                {
                    this.state.isLoading &&
                    <div className="center margin-top-20">
                        <Spinner size='big'/>
                    </div>
                }

                {
                    this.state.articles && this.state.articles.length > 0 &&
                    <ArticleListDisplay articles={this.state.articles}
                                        hasMore={this.state.hasMore}
                                        highlightResults={this.state.highlightResults}
                                        articleDisplayMode={this.state.articleDisplayMode}/>
                }

                {
                    this.state.articles && this.state.articles.length == 0 &&
                    <ArticleNone isTopicPage={!!this.props.params.topicId}/>
                }
            </div>
        );
    }
});

module.exports = ArticleIndex;
