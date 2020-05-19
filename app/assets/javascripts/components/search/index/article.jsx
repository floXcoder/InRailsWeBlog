'use strict';

import {
    Suspense
} from 'react';

import Typography from '@material-ui/core/Typography';

import {
    ArticleGridModeSearch
} from '../../loaders/components';

import ArticleSearchMenuDisplay from './articles/menu';
import ArticleSearchItemDisplay from './articles/item';

export default class SearchArticleIndex extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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

    constructor(props) {
        super(props);
    }

    render() {
        const isGridDisplay = this.props.searchDisplay === 'grid';

        let currentTopicArticles, otherTopicsArticles;

        if (this.props.currentUserTopicId) {
            currentTopicArticles = this.props.articles.filter((article) => article.topicId === this.props.currentUserTopicId);
            otherTopicsArticles = this.props.articles.filter((article) => article.topicId !== this.props.currentUserTopicId);
        }

        return (
            <div className={this.props.classes.category}>
                <ArticleSearchMenuDisplay classes={this.props.classes}
                                          currentUserId={this.props.currentUserId}
                                          articlesCount={this.props.articles.length}
                                          searchDisplay={this.props.searchDisplay}
                                          onSettingsClick={this.props.onSettingsClick}
                                          onOrderChange={this.props.onOrderChange}
                                          onDisplayChange={this.props.onDisplayChange}
                                          onURLSearchSubmit={this.props.onURLSearchSubmit}/>

                <div>
                    {
                        isGridDisplay
                            ?
                            <Suspense fallback={<div/>}>
                                {
                                    currentTopicArticles?.length > 0 &&
                                    <>
                                        <Typography className={this.props.classes.categorySubtitle}
                                                    variant="subtitle2"
                                                    gutterBottom={true}>
                                            {I18n.t('js.search.index.topic.current')}
                                        </Typography>

                                        <ArticleGridModeSearch searchGridColumns={this.props.searchGridColumns}
                                                               articles={currentTopicArticles}/>
                                    </>
                                }

                                {
                                    (otherTopicsArticles?.length > 0) &&
                                    <>
                                        <Typography className={this.props.classes.categorySubtitle}
                                                    variant="subtitle2"
                                                    gutterBottom={true}>
                                            {I18n.t('js.search.index.topic.others')}
                                        </Typography>
                                        <ArticleGridModeSearch searchGridColumns={this.props.searchGridColumns}
                                                               articles={otherTopicsArticles}/>
                                    </>
                                }

                                {
                                    !this.props.currentUserTopicId &&
                                    <ArticleGridModeSearch searchGridColumns={this.props.searchGridColumns}
                                                           articles={this.props.articles}/>
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
                                                                          highlightTagIds={this.props.selectedTagIds}
                                                                          article={article}/>
                                            ))
                                        }
                                    </>
                                }

                                {
                                    (otherTopicsArticles?.length > 0) &&
                                    <>
                                        <Typography className={this.props.classes.articleOther}
                                                    variant="subtitle2"
                                                    gutterBottom={true}>
                                            {I18n.t('js.search.index.topic.others')}
                                        </Typography>

                                        {
                                            otherTopicsArticles.map((article) => (
                                                <ArticleSearchItemDisplay key={article.id}
                                                                          highlightTagIds={this.props.selectedTagIds}
                                                                          article={article}/>
                                            ))
                                        }
                                    </>
                                }

                                {
                                    !this.props.currentUserTopicId &&
                                    this.props.articles.map((article) => (
                                        <ArticleSearchItemDisplay key={article.id}
                                                                  highlightTagIds={this.props.selectedTagIds}
                                                                  article={article}/>
                                    ))
                                }
                            </>
                    }
                </div>
            </div>
        );
    }
}
