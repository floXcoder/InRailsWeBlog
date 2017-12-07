'use strict';

// import ArticleActions from '../../../actions/articleActions';

// import InfiniteScroll from '../../materialize/infiniteScroll';

import ArticleItemDisplay from './item';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

const ArticleListDisplay = ({articleIds, articleDisplayMode}) => {
    const ArticleNodes = articleIds.map((articleId) => (
            <CSSTransition key={articleId}
                           timeout={500}
                           classNames="article">
                <ArticleItemDisplay articleId={articleId}
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
    articleIds: PropTypes.array.isRequired,
    articleDisplayMode: PropTypes.string.isRequired
};

ArticleListDisplay.getDefaultProps = {
};

export default ArticleListDisplay;
