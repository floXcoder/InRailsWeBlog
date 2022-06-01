'use strict';

import MasonryWrapper from '../../../theme/masonry';

import ArticleGridDisplay from '../articles/grid';

const ArticleMasonry = MasonryWrapper(ArticleGridDisplay);


function ArticleGridModeSearch({
                                   articles,
                                   searchGridColumns
                               }) {
    return (
        <ArticleMasonry type="article"
                        elements={articles}
                        topOffset={40}
                        hasColumnButtons={false}
                        columnCount={searchGridColumns}
                        hasExposedMode={false}
                        isActive={true}
                        isPaginated={false}/>
    );
}

ArticleGridModeSearch.propTypes = {
    articles: PropTypes.array.isRequired,
    searchGridColumns: PropTypes.number
};

export default ArticleGridModeSearch;
