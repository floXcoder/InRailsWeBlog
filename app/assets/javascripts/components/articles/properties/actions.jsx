'use strict';

import FixedActionButton from '../../materialize/fab';

import ArticleEditIcon from '../icons/edit';
// TODO
// import ArticleLinkIcon from '../icons/link';
import ArticleVisibilityIcon from '../icons/visibility';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleLink from '../properties/link';

const ArticleActions = ({articleId, articleSlug, articleVisibility, onBookmarkClick, onEditClick, onVisibilityClick, isOwner}) => (
    <FixedActionButton>
        <ArticleBookmarkIcon articleId={articleId}
                             onBookmarkClick={onBookmarkClick}/>

        <ArticleVisibilityIcon articleId={articleId}
                               articleVisibility={articleVisibility}
                               hasFloatingButton={true}
                               onVisibilityClick={onVisibilityClick}/>

        <ArticleEditIcon onEditClick={onEditClick}
                         isOwner={isOwner}/>

        <ArticleLink articleId={articleId}
                     articleSlug={articleSlug}
                     onArticleClick={_handleArticleClick.bind(null, articleId)}/>
    </FixedActionButton>
);

const _handleArticleClick = (article) => {
    // TODO
    // ArticleStore.onTrackClick(article.id);
};

ArticleActions.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    onBookmarkClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onVisibilityClick: PropTypes.func,
    isOwner: PropTypes.bool
};

ArticleEditIcon.defaultProps = {
    isOwner: false
};

export default ArticleActions;
