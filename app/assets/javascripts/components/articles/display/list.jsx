'use strict';

// import ArticleActions from '../../../actions/articleActions';

// import InfiniteScroll from '../../materialize/infiniteScroll';

import ArticleItemDisplay from './item';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

const ArticleListDisplay = ({articles, articleDisplayMode}) => {
    const ArticleNodes = articles.map((article) => (
            <CSSTransition key={article.id}
                           timeout={500}
                           classNames="article">
                <ArticleItemDisplay article={article}
                                    initialDisplayMode={articleDisplayMode}/>
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
                            {/*<InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}*/}
                            {/*hasMore={hasMore}>*/}
                            {/**/}
                            {/*</InfiniteScroll>*/}

                            <TransitionGroup component="div">
                                {ArticleNodes}
                            </TransitionGroup>
                        </div>
                    </div>
                }

                {
                    articleDisplayMode === 'card' &&
                    <div className="blog-article-list">
                        {/*<InfiniteScroll loadMore={ArticleListDisplay._loadNextArticles.bind(hasMore)}*/}
                        {/*hasMore={hasMore}>*/}
                        {/**/}
                        {/*</InfiniteScroll>*/}

                        <TransitionGroup component="div">
                            {ArticleNodes}
                        </TransitionGroup>
                    </div>
                }
            </div>
        </div>
    );
};

// TODO: infinite loading
// ArticleListDisplay._loadNextArticles = (hasMore) => {
//     if (hasMore) {
//         ArticleActions.loadNextArticles();
//     }
// };

ArticleListDisplay.propTypes = {
    articles: PropTypes.array.isRequired,
    articleDisplayMode: PropTypes.string.isRequired
};

export default ArticleListDisplay;
