'use strict';

import {
    fetchArticles
} from '../../actions';

import {
    getArticlePagination,
    getArticles
} from '../../selectors';

import Spinner from '../materialize/spinner';

import ArticleListDisplay from './display/list';
import ArticleNone from '../articles/display/none';

@connect((state) => ({
    userCurrentId: state.userState.currentId,
    topicCurrentId: state.topicState.currentTopic && state.topicState.currentTopic.id,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state),
    articlePagination: getArticlePagination(state),
    articlesLoaderMode: state.uiState.articlesLoaderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    articleEditionId: state.articleState.articleEditionId
}), {
    fetchArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        userCurrentId: PropTypes.number,
        topicCurrentId: PropTypes.number,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        articlePagination: PropTypes.object,
        articleEditionId: PropTypes.number,
        articlesLoaderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        fetchArticles: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._fetchInitArticles(props.params);
    }

    componentWillReceiveProps(nextProps) {
        if (!Object.equals(this.props.params, nextProps.params)) {
            this._fetchInitArticles(nextProps.params);
        }
    }

    _filterParams = (params = {}) => {
        return {
            userId: params.userCurrentId || this.props.userCurrentId,
            topicId: params.topicCurrentId || this.props.topicCurrentId,
            ...params
        };
    };

    _fetchInitArticles = (params) => {
        let options = {};
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }
        this.props.fetchArticles(this._filterParams(params), options);
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages) {
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this.props.fetchArticles(this._filterParams(), options, {infinite: !params.selected})
                .then(() => {
                    if (params.selected) {
                        setTimeout(() => {
                            $('html, body').animate({scrollTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top - 64}, 750);
                        }, 300);
                    }
                });
        }
    };

    render() {
        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        return (
            <div className="blog-article-box">
                {
                    this.props.isFetching &&
                    <div className="center margin-top-20">
                        <Spinner size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleListDisplay articles={this.props.articles}
                                        articlesLoaderMode={this.props.articlesLoaderMode}
                                        articleDisplayMode={this.props.articleDisplayMode}
                                        articleEditionId={this.props.articleEditionId}
                                        hasMoreArticles={hasMoreArticles}
                                        articleTotalPages={this.props.articlePagination && this.props.articlePagination.totalPages}
                                        fetchArticles={this._fetchNextArticles}/>
                }

                {
                    (this.props.articles.length === 0 && !this.props.isFetching) &&
                    <ArticleNone topicSlug={this.props.params.topicSlug}/>
                }
            </div>
        );
    }
}
