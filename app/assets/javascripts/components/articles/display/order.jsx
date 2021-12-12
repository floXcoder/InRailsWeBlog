'use strict';

import IconButton from '@material-ui/core/IconButton';

import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';

import ArticleSortMenu from '../sort/dropdown';
// import ArticleFilterMenu from '../filter/dropdown';

var ArticleOrderDisplay = function (props) {
    return (
        <div className="article-sidebar-order">
            <ArticleSortMenu currentUserSlug={props.currentUserSlug}
                             currentUserTopicSlug={props.currentUserTopicSlug}
                             currentOrder={props.articleOrderMode}
                             onOrderChange={props.onOrderChange}/>

            {
                // this.props.currentUserId &&
                // <ArticleFilterMenu/>
            }

            {
                (props.articleDisplayMode === 'card' || props.articleDisplayMode === 'grid') &&
                <IconButton aria-label="Minimize all"
                            onClick={props.onMinimized}>
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
    articleOrderMode: PropTypes.string,
    articleDisplayMode: PropTypes.string
};

export default React.memo(ArticleOrderDisplay);
