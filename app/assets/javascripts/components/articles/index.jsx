'use strict';

import _ from 'lodash';

import Spinner from '../../components/materialize/spinner';

import UserStore from '../../stores/userStore';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';
import ArticleListDisplay from './display/list';
import ArticleNone from '../../components/articles/display/none';

export default class ArticleIndex extends Reflux.Component {
    static propTypes = {
        router: PropTypes.object.isRequired
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    state = {
        articles: null,
        isLoading: true,
        hasMore: true,
        articleDisplayMode: 'card',
        highlightResults: true
    };

    componentWillMount() {
        ArticleActions.loadArticles(this.props.router.match.params);
    }

    componentDidMount() {
        this._activateTooltip();
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.router.match, nextProps.router.match)) {
            ArticleActions.loadArticles(nextProps.router.match.params);
        }
    }

    componentDidUpdate() {
        this._activateTooltip();
    }

    _activateTooltip = () => {
        let $currentElement = $(ReactDOM.findDOMNode(this).className);
        $currentElement.ready(() => {
            $currentElement.find('.tooltipped').tooltip({
                position: "bottom",
                delay: 50
            });
        });
    };

    onPreferenceChange = (userData) => {
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
    };

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
                    <ArticleListDisplay router={this.props.router}
                                        articles={this.state.articles}
                                        hasMore={this.state.hasMore}
                                        highlightResults={this.state.highlightResults}
                                        articleDisplayMode={this.state.articleDisplayMode}/>
                }

                {
                    this.state.articles && this.state.articles.length === 0 &&
                    <ArticleNone router={this.props.router}
                                 isTopicPage={!!this.props.router.match.params.topicSlug}/>
                }
            </div>
        );
    }
}
