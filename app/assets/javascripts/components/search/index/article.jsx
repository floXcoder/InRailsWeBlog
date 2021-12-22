'use strict';

import {Suspense} from 'react';

import Typography from '@mui/material/Typography';

import {ArticleGridModeSearch} from '../../loaders/components';

import ArticleSearchMenuDisplay from './articles/menu';
import ArticleSearchItemDisplay from './articles/item';


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
                                    <Typography className="search-index-categorySubtitle"
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
                                    <Typography className="search-index-categorySubtitle"
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
                                    <Typography className="search-index-articleOther"
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
