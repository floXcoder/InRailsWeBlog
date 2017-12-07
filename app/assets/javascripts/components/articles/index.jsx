'use strict';

import {
    connect
} from 'react-redux';

import {
    withRouter
} from 'react-router-dom';

import {
    loadArticles
} from '../../actions/index';

import {
    getArticlesIds,
    getArticlesCount
} from '../../selectors/articleSelectors';

import Spinner from '../materialize/spinner';

import ArticleListDisplay from './display/list';
import ArticleNone from '../articles/display/none';

@withRouter
@connect((state, props) => ({
    isFetching: state.articleState.isFetching,
    articleIds: getArticlesIds(state.articleState),
    articlesCount: getArticlesCount(state.articleState)
}), {
    loadArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        articleIds: PropTypes.array.isRequired,
        articlesCount: PropTypes.number.isRequired

        // TODO
        // loadArticles: PropTypes.func.isRequired,
        // match: PropTypes.object.isRequired,
        // location: PropTypes.object.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    state = {
        // TODO
        hasMore: true,
        articleDisplayMode: 'card'
    };

    componentWillMount() {
        this.props.loadArticles({filter: this.props.match.params});
    }

    // componentDidMount() {
    //     this._activateTooltip();
    // }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.props.loadArticles({filter: this.props.match.params});
        }
    }

    // componentDidUpdate() {
    //     this._activateTooltip();
    // }

    // TODO: replace tooltip by semantic
    // _activateTooltip = () => {
    //     let $currentElement = $(ReactDOM.findDOMNode(this).className);
    //     $currentElement.ready(() => {
    //         $currentElement.find('.tooltipped').tooltip({
    //             position: "bottom",
    //             delay: 50
    //         });
    //     });
    // };

    // TODO
    // onPreferenceChange(userData) {
    //     let newState = {};
    //
    //     if (!$.isEmpty(userData.settings) && userData.settings.article_display) {
    //         newState.articleDisplayMode = userData.settings.article_display;
    //     }
    //
    //     if (!$.isEmpty(userData.search) && userData.search.search_highlight) {
    //         newState.highlightResults = userData.search.search_highlight;
    //     }
    //
    //     if (!$.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // };

    // TODO
    // onArticleChange(articleData) {
    //     if ($.isEmpty(articleData)) {
    //         return;
    //     }
    //
    //     let newState = {};
    //
    //     if (articleData.type === 'loadArticles') {
    //         newState.articles = articleData.articles;
    //         newState.isFetching = false;
    //     }
    //
    //     if (!$.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // }

    render() {
        return (
            <div className="blog-article-box">
                {
                    this.props.isFetching
                        ?
                        <div className="center margin-top-20">
                            <Spinner size='big'/>
                        </div>
                        :
                        this.props.articlesCount === 0
                            ?
                            <ArticleNone topicSlug={this.props.match.params.topicSlug}/>
                            :
                            <ArticleListDisplay articleIds={this.props.articleIds}
                                                articleDisplayMode={this.state.articleDisplayMode}/>
                }
            </div>
        );
    }
}
