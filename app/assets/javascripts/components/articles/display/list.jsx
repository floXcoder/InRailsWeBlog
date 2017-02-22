'use strict';

const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const InfiniteScroll = require('../../../components/materialize/infiniteScroll');

const ArticleActions = require('../../../actions/articleActions');
const ArticleItemDisplay = require('./item');

var ArticleListDisplay = ({articles, hasMore, articleDisplayMode, isHighlightingResults}) => {
    const ArticleNodes = articles.map((article) =>
        <ArticleItemDisplay
            key={article.id}
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
    articles: React.PropTypes.array.isRequired,
    hasMore: React.PropTypes.bool.isRequired,
    articleDisplayMode: React.PropTypes.string.isRequired,
    isHighlightingResults: React.PropTypes.bool
};

ArticleListDisplay.getDefaultProps = {
    isHighlightingResults: false
};

ArticleListDisplay._loadNextArticles = (hasMore) => {
    if (hasMore) {
        ArticleActions.loadNextArticles();
    }
};

module.exports = ArticleListDisplay;
