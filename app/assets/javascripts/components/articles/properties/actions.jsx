'use strict';

// TODO
// import ArticleStore from '../../../stores/articleStore';

import FixedActionButton from '../../materialize/fab';

import ArticleEditIcon from '../icons/edit';
// import ArticleLinkIcon from '../icons/link';
import ArticleVisibilityIcon from '../icons/visibility';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleLink from '../properties/link';

const ArticleActions = ({articleId, articleSlug, onBookmarkClick, onEditClick, onVisibilityClick}) => (
    <FixedActionButton>
        <ArticleBookmarkIcon articleId={articleId}
                             onBookmarkClick={onBookmarkClick}/>

        <ArticleVisibilityIcon articleId={articleId}
                               hasFloatingButton={true}
                               onVisibilityClick={onVisibilityClick}/>

        <ArticleEditIcon articleId={articleId}
                         onEditClick={onEditClick}/>

        <ArticleLink articleId={articleId}
                     articleSlug={articleSlug}
                     onArticleClick={_handleArticleClick.bind(undefined, articleId)}/>
    </FixedActionButton>
);

const _handleArticleClick = (article) => {
    // TODO
    // ArticleStore.onTrackClick(article.id);
};

ArticleActions.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    onBookmarkClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onVisibilityClick: PropTypes.func
};

export default ArticleActions;
