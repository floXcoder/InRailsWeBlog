'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    fetchArticles
} from '../../actions';

import {
    getArticles
} from '../../selectors';

import Spinner from '../materialize/spinner';

import ArticleListDisplay from './display/list';
import ArticleNone from '../articles/display/none';

@withRouter
@connect((state) => ({
    isFetching: state.articleState.isFetching,
    articles: getArticles(state)
}), {
    fetchArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        // From connect
        isFetching: PropTypes.bool.isRequired,
        articles: PropTypes.array.isRequired,
        fetchArticles: PropTypes.func.isRequired,

        // TODO
        // From router
        match: PropTypes.object,
        // location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        props.fetchArticles({filter: props.match.params});
    }

    state = {
        // TODO
        hasMore: true,
        articleDisplayMode: 'card'
    };

    // componentDidMount() {
    //     this._activateTooltip();
    // }

    componentWillReceiveProps(nextProps) {
        // TODO
        // if (this.props.location.pathname !== nextProps.location.pathname) {
        //     this.props.loadArticles({filter: this.props.match.params});
        // }
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
                        this.props.articles.length > 0
                            ?
                            <ArticleListDisplay articles={this.props.articles}
                                                articleDisplayMode={this.state.articleDisplayMode}/>
                            :
                            <ArticleNone topicSlug={this.props.match.params.topicSlug}/>

                }
            </div>
        );
    }
}
