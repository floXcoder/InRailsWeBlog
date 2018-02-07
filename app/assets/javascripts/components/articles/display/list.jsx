'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import InfiniteScroll from 'react-infinite-scroll-component';

import ArticleItemDisplay from './item';

import Pagination from '../../materialize/pagination';

const ArticleListDisplay = ({articles, articlesLoaderMode, articleDisplayMode, articleEditionId, hasMoreArticles, articleTotalPages, fetchArticles}) => {
    const ArticleNodes = articles.map((article) => (
            <CSSTransition key={article.id}
                           timeout={150}
                           classNames="article">
                <ArticleItemDisplay article={article}
                                    articleDisplayMode={articleDisplayMode}
                                    articleEditionId={articleEditionId}/>
            </CSSTransition>
        )
    );

    const LoadingArticles = (
        <div className="article-infinite-loading">
            {I18n.t('js.article.common.infinite.loading')}
        </div>
    );

    return (
        <div>
            <div className={classNames({
                'card-panel': articleDisplayMode === 'inline'
            })}>
                <div className="blog-article-list">
                    {
                        articlesLoaderMode === 'infinite'
                            ?
                            <InfiniteScroll next={fetchArticles}
                                            hasMore={hasMoreArticles}
                                            loader={LoadingArticles}>
                                <TransitionGroup component="div">
                                    {ArticleNodes}
                                </TransitionGroup>
                            </InfiniteScroll>
                            :
                            <TransitionGroup component="div">
                                {ArticleNodes}
                            </TransitionGroup>
                    }
                </div>
            </div>

            {
                articlesLoaderMode === 'pagination' &&
                <Pagination totalPages={articleTotalPages}
                            onPaginationClick={fetchArticles}/>
            }
        </div>
    );
};

ArticleListDisplay.propTypes = {
    articles: PropTypes.array.isRequired,
    articlesLoaderMode: PropTypes.string.isRequired,
    articleDisplayMode: PropTypes.string.isRequired,
    fetchArticles: PropTypes.func,
    articleTotalPages: PropTypes.number,
    hasMoreArticles: PropTypes.bool,
    articleEditionId: PropTypes.number
};

export default ArticleListDisplay;
