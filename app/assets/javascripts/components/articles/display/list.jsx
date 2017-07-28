'use strict';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InfiniteScroll from '../../../components/materialize/infiniteScroll';

import ArticleActions from '../../../actions/articleActions';
import ArticleItemDisplay from './item';

const ArticleListDisplay = ({router, articles, hasMore, articleDisplayMode, isHighlightingResults}) => {
    const ArticleNodes = articles.map((article) =>
        <ArticleItemDisplay key={article.id}
                            router={router}
                            article={article}
                            initialDisplayMode={articleDisplayMode}>
            {
                isHighlightingResults && !$.isEmpty(article.highlight_content) ?
                    article.highlight_content :
                    article.content
            }
        </ArticleItemDisplay>
    );

    return (
        <div className="row">
            <div className="col s12">
                <ReactCSSTransitionGroup transitionName="article"
                                         transitionAppear={true}
                                         transitionAppearTimeout={500}
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                    {
                        articleDisplayMode === 'inline' &&
                        <div className="card-panel">
                            <div className="blog-article-list">
                                <InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}
                                                hasMore={hasMore}>
                                    <ReactCSSTransitionGroup transitionName="article"
                                                             transitionAppear={true}
                                                             transitionAppearTimeout={500}
                                                             transitionEnterTimeout={500}
                                                             transitionLeaveTimeout={300}>
                                        {ArticleNodes}
                                    </ReactCSSTransitionGroup>
                                </InfiniteScroll>
                            </div>
                        </div>
                    }

                    {
                        articleDisplayMode === 'card' &&
                        <div className="blog-article-list">
                            <InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}
                                            hasMore={hasMore}>
                                <ReactCSSTransitionGroup transitionName="article"
                                                         transitionAppear={true}
                                                         transitionAppearTimeout={500}
                                                         transitionEnterTimeout={500}
                                                         transitionLeaveTimeout={300}>
                                    {ArticleNodes}
                                </ReactCSSTransitionGroup>
                            </InfiniteScroll>
                        </div>
                    }
                </ReactCSSTransitionGroup>
            </div>
        </div>
    );
};

ArticleListDisplay.propTypes = {
    router: React.PropTypes.object.isRequired,
    articles: React.PropTypes.array.isRequired,
    hasMore: React.PropTypes.bool.isRequired,
    articleDisplayMode: React.PropTypes.string.isRequired,
    isHighlightingResults: React.PropTypes.bool
};

ArticleListDisplay.getDefaultProps = {
    isHighlightingResults: false
};

ArticleListDisplay._loadNextArticles = (hasMore) => {
    // TODO: infinite loading
    // if (hasMore) {
    //     ArticleActions.loadNextArticles();
    // }
};

export default ArticleListDisplay;
