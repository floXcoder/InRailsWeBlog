'use strict';

import BookmarkIcon from '../../bookmark/icon';

function ArticleBookmarkIcon({
                                 articleId,
                                 size,
                                 color
                             }) {
    return (
        <BookmarkIcon bookmarkedType="article"
                      bookmarkedId={articleId}
                      className="article-bookmark"
                      isIcon={true}
                      color={color}
                      size={size}/>
    );
}

ArticleBookmarkIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

ArticleBookmarkIcon.defaultProps = {
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleBookmarkIcon);
