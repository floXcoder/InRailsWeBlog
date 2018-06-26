'use strict';

import BookmarkIcon from '../../bookmark/icon';

const ArticleEditIcon = ({articleId}) => (
    <BookmarkIcon bookmarkedType="article"
                  bookmarkedId={articleId}
                  className="article-bookmark"
                  isIcon={true}/>
);

ArticleEditIcon.propTypes = {
    articleId: PropTypes.number.isRequired
};

export default ArticleEditIcon;
