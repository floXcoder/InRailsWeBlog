'use strict';

import Spinner from '../../components/materialize/spinner';

import UserStore from '../../stores/userStore';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';
import ArticleListDisplay from './display/list';
import ArticleNone from '../../components/articles/display/none';

export default class ArticleIndex extends React.Component {
    static propTypes = {
        // Populate by react-router
        params: React.PropTypes.object
    };

    static defaultProps = {
        params: {}
    };

    state = {
        articles: null,
        isLoading: true,
        hasMore: true,
        articleDisplayMode: 'card',
        highlightResults: true
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    componentDidMount() {
        ArticleActions.loadArticles(this.props.params);

        this._activateTooltip();
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.params, nextProps.params)) {
            ArticleActions.loadArticles(nextProps.params);
        }
    }

    componentDidUpdate() {
        this._activateTooltip();
    }

    _activateTooltip() {
        let $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(() => {
            $currentElement.find('.tooltipped').tooltip({
                position: "bottom",
                delay: 50
            });
        });
    }

    onPreferenceChange(userData) {
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
    }

    onArticleChange(articleData) {
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
    }

    render() {
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
}
