'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import InfiniteScroll from 'react-infinite-scroll-component';

import Pagination from '../../materialize/pagination';

import MasonryWrapper from '../../theme/masonry';

import ArticleItemDisplay from './item';

const ArticleMasonry = MasonryWrapper(ArticleItemDisplay, {articleDisplayMode: 'grid'}, ArticleItemDisplay, {articleDisplayMode: 'card'});

const ArticleListDisplay = ({articles, articlesLoaderMode, articleDisplayMode, articleEditionId, hasMoreArticles, isSortedByTag, isMinimized, parentTag, articleTotalPages, fetchArticles}) => {
    let previousTag, ArticleNodes;

    if (articleDisplayMode === 'grid') {
        ArticleNodes = (
            <ArticleMasonry type="article"
                            elements={articles}
                            topOffset={40}
                            hasColumnButtons={true}
                            hasExposedMode={true}
                            isActive={true}
                            isPaginated={false}/>
        );
    } else {
        ArticleNodes = (
            <TransitionGroup component="div">
                {
                    articles.map((article) => {
                            let tagTitle;
                            if (isSortedByTag) {
                                let currentTags = article.tags.toJS();
                                if (parentTag) {
                                    currentTags = currentTags.filter((tag) => !article.parentTagIds.includes(tag.id) && tag.slug !== parentTag)
                                }
                                let currentTag = currentTags.map((tag) => tag.name).sort().first();
                                if (previousTag !== currentTag) {
                                    tagTitle = currentTag;
                                    previousTag = currentTag;
                                }
                                if (article.tags.size === (!!parentTag ? 1 : 0)) {
                                    previousTag = tagTitle = I18n.t('js.article.common.tags.none');
                                }
                            }

                            return (
                                <CSSTransition key={article.id}
                                               timeout={150}
                                               classNames="article">
                                    <div>
                                        {
                                            tagTitle &&
                                            <h6 className="article-list-tag-title">
                                                {tagTitle}
                                            </h6>
                                        }

                                        <ArticleItemDisplay article={article}
                                                            articleDisplayMode={articleDisplayMode}
                                                            articleEditionId={articleEditionId}
                                                            isMinimized={isMinimized}/>
                                    </div>

                                </CSSTransition>
                            );
                        }
                    )}
            </TransitionGroup>
        );
    }

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
                                    {ArticleNodes}
                                </InfiniteScroll>
                                :
                                ArticleNodes
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
    isSortedByTag: PropTypes.bool,
    isMinimized: PropTypes.bool,
    parentTag: PropTypes.string,
    articleEditionId: PropTypes.number
};

ArticleListDisplay.defaultProps = {
    hasMoreArticles: false,
    isSortedByTag: false,
    isMinimized: false
};

export default ArticleListDisplay;
