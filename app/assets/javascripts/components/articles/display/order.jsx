'use strict';

import IconButton from '@mui/material/IconButton';

import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

import ArticleSortMenu from '../sort/dropdown';
// import ArticleFilterMenu from '../filter/dropdown';


const ArticleOrderDisplay = function ({
                                          onMinimized,
                                          onOrderChange,
                                          currentUserSlug,
                                          currentUserTopicSlug,
                                          currentUserTagSlug,
                                          articleOrderMode,
                                          articleDisplayMode
                                      }) {
    return (
        <div className="article-sidebar-order">
            <ArticleSortMenu currentUserSlug={currentUserSlug}
                             currentUserTopicSlug={currentUserTopicSlug}
                             currentUserTagSlug={currentUserTagSlug}
                             currentOrder={articleOrderMode}
                             onOrderChange={onOrderChange}/>

            {
                // this.currentUserId &&
                // <ArticleFilterMenu/>
            }

            {
                (articleDisplayMode === 'card' || articleDisplayMode === 'grid') &&
                <IconButton aria-label="Minimize all" onClick={onMinimized} size="large">
                    <VerticalAlignBottomIcon className="article-sidebar-button"/>
                </IconButton>
            }
        </div>
    );
};

ArticleOrderDisplay.propTypes = {
    onMinimized: PropTypes.func.isRequired,
    onOrderChange: PropTypes.func.isRequired,
    currentUserSlug: PropTypes.string,
    currentUserTopicSlug: PropTypes.string,
    currentUserTagSlug: PropTypes.string,
    articleOrderMode: PropTypes.string,
    articleDisplayMode: PropTypes.string
};

export default React.memo(ArticleOrderDisplay);
