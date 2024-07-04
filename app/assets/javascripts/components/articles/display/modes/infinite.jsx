'use strict';

import InfiniteScroll from 'react-infinite-scroll-component';

function ArticleInfiniteMode({
                                 fetchArticles,
                                 articlesCount,
                                 children,
                                 hasMoreArticles = false
                             }) {
    const LoadingArticles = (
        <div className="article-infinite-text">
            {I18n.t('js.article.common.infinite.loading')}
        </div>
    );

    return (
        <InfiniteScroll dataLength={articlesCount}
                        next={fetchArticles}
                        hasMore={hasMoreArticles}
                        loader={LoadingArticles}>
            {children}
        </InfiniteScroll>
    );
}

ArticleInfiniteMode.propTypes = {
    fetchArticles: PropTypes.func.isRequired,
    articlesCount: PropTypes.number.isRequired,
    children: PropTypes.object.isRequired,
    hasMoreArticles: PropTypes.bool
};

export default ArticleInfiniteMode;
