import React from 'react';
import PropTypes from 'prop-types';

import BookmarkIcon from '@js/components/bookmark/icon';

function ArticleBookmarkIcon({
                                 articleId,
                                 size = 'medium',
                                 color = 'primary'
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

export default React.memo(ArticleBookmarkIcon);
