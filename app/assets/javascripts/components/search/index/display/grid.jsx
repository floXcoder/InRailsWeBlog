import PropTypes from 'prop-types';

import MasonryWrapper from '@js/components/theme/masonry';

import ArticleGridDisplay from '@js/components/search/index/articles/grid';

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
