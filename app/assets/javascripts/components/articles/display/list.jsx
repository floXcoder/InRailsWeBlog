'use strict';

// import ArticleActions from '../../../actions/articleActions';

import InfiniteScroll from '../../../components/materialize/infiniteScroll';

import ArticleItemDisplay from './item';

import {TransitionGroup, CSSTransition} from 'react-transition-group';

const ArticleListDisplay = ({router, articles, hasMore, articleDisplayMode, isHighlightingResults}) => {
    const ArticleNodes = articles.map((article) => (
            <CSSTransition key={article.id}
                           timeout={500}
                           classNames="article">
                <ArticleItemDisplay router={router}
                                    article={article}
                                    initialDisplayMode={articleDisplayMode}>
                    {
                        isHighlightingResults && !$.isEmpty(article.highlight_content) ?
                            article.highlight_content :
                            article.content
                    }
                </ArticleItemDisplay>
            </CSSTransition>
        )
    );

    return (
        <div className="row">
            <div className="col s12">
                {
                    articleDisplayMode === 'inline' &&
                    <div className="card-panel">
                        <div className="blog-article-list">
                            <InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}
                                            hasMore={hasMore}>
                                <TransitionGroup component="div">
                                    {ArticleNodes}
                                </TransitionGroup>
                            </InfiniteScroll>
                        </div>
                    </div>
                }

                {
                    articleDisplayMode === 'card' &&
                    <div className="blog-article-list">
                        <InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}
                                        hasMore={hasMore}>
                            <TransitionGroup component="div">
                                {ArticleNodes}
                            </TransitionGroup>
                        </InfiniteScroll>
                    </div>
                }
            </div>
        </div>
    );
};

ArticleListDisplay.propTypes = {
    router: PropTypes.object.isRequired,
    articles: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
    articleDisplayMode: PropTypes.string.isRequired,
    isHighlightingResults: PropTypes.bool
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
