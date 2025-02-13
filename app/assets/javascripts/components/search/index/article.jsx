import React, {Suspense} from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import I18n from '@js/modules/translations';

import {ArticleGridModeSearch} from '@js/components/loaders/components';

import ArticleSearchMenuDisplay from '@js/components/search/index/articles/menu';
import ArticleSearchItemDisplay from '@js/components/search/index/articles/item';


const SearchArticleIndex = function (props) {
    const isGridDisplay = props.searchDisplay === 'grid';

    let currentTopicArticles;
    let otherTopicsArticles;

    if (props.currentUserTopicId) {
        currentTopicArticles = props.articles.filter((article) => article.topicId === props.currentUserTopicId);
        otherTopicsArticles = props.articles.filter((article) => article.topicId !== props.currentUserTopicId);
    }

    return (
        <div className="search-index-category">
            <ArticleSearchMenuDisplay currentUserId={props.currentUserId}
                                      articlesCount={props.articles.length}
                                      searchDisplay={props.searchDisplay}
                                      onSettingsClick={props.onSettingsClick}
                                      onOrderChange={props.onOrderChange}
                                      onDisplayChange={props.onDisplayChange}
                                      onURLSearchSubmit={props.onURLSearchSubmit}/>

            <div>
                {
                    isGridDisplay
                        ?
                        <Suspense fallback={<div/>}>
                            {
                                currentTopicArticles?.length > 0 &&
                                <>
                                    <Typography className="search-index-category-subtitle"
                                                variant="subtitle2"
                                                gutterBottom={true}>
                                        {I18n.t('js.search.index.topic.current')}
                                    </Typography>

                                    <ArticleGridModeSearch searchGridColumns={props.searchGridColumns}
                                                           articles={currentTopicArticles}/>
                                </>
                            }

                            {
                                (otherTopicsArticles?.length > 0) &&
                                <>
                                    <Typography className="search-index-category-subtitle"
                                                variant="subtitle2"
                                                gutterBottom={true}>
                                        {I18n.t('js.search.index.topic.others')}
                                    </Typography>
                                    <ArticleGridModeSearch searchGridColumns={props.searchGridColumns}
                                                           articles={otherTopicsArticles}/>
                                </>
                            }

                            {
                                !props.currentUserTopicId &&
                                <ArticleGridModeSearch searchGridColumns={props.searchGridColumns}
                                                       articles={props.articles}/>
                            }
                        </Suspense>
                        :
                        <>
                            {
                                currentTopicArticles?.length > 0 &&
                                <>
                                    {/*<Typography variant="subtitle2"*/}
                                    {/*            gutterBottom={true}>*/}
                                    {/*    {I18n.t('js.search.index.topic.current')}*/}
                                    {/*</Typography>*/}

                                    {
                                        currentTopicArticles.map((article) => (
                                            <ArticleSearchItemDisplay key={article.id}
                                                                      highlightTagIds={props.selectedTagIds}
                                                                      article={article}/>
                                        ))
                                    }
                                </>
                            }

                            {
                                (otherTopicsArticles?.length > 0) &&
                                <>
                                    <Typography className="search-index-article-other"
                                                variant="subtitle2"
                                                gutterBottom={true}>
                                        {I18n.t('js.search.index.topic.others')}
                                    </Typography>

                                    {
                                        otherTopicsArticles.map((article) => (
                                            <ArticleSearchItemDisplay key={article.id}
                                                                      highlightTagIds={props.selectedTagIds}
                                                                      article={article}/>
                                        ))
                                    }
                                </>
                            }

                            {
                                !props.currentUserTopicId &&
                                props.articles.map((article) => (
                                    <ArticleSearchItemDisplay key={article.id}
                                                              highlightTagIds={props.selectedTagIds}
                                                              article={article}/>
                                ))
                            }
                        </>
                }
            </div>
        </div>
    );
};

SearchArticleIndex.propTypes = {
    selectedTagIds: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
    onOrderChange: PropTypes.func.isRequired,
    onDisplayChange: PropTypes.func.isRequired,
    onURLSearchSubmit: PropTypes.func.isRequired,
    searchDisplay: PropTypes.string.isRequired,
    currentUserId: PropTypes.number,
    currentUserTopicId: PropTypes.number,
    searchGridColumns: PropTypes.number
};

export default React.memo(SearchArticleIndex);
