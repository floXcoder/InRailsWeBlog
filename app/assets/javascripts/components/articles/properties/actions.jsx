'use strict';

import ArticleStore from '../../../stores/articleStore';

import FixedActionButton from '../../materialize/fab';

import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';
import ArticleVisibilityIcon from '../icons/visibility';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleLink from '../properties/link';

const ArticleActions = ({article, onBookmarkClick, onEditClick, onVisibilityClick}) => (
    <FixedActionButton>
        <ArticleBookmarkIcon article={article}
                             onBookmarkClick={onBookmarkClick}/>

        <ArticleVisibilityIcon article={article}
                               hasFloatingButton={true}
                               onVisibilityClick={onVisibilityClick}/>

        <ArticleEditIcon article={article}
                         onEditClick={onEditClick}/>

        <ArticleLink article={article}
                     onArticleClick={(article, event) => {
                         this._handleArticleClick.bind(article, event)
                     }}/>
    </FixedActionButton>
);

ArticleActions.propTypes = {
    article: PropTypes.object.isRequired,
    onBookmarkClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func,
    onVisibilityClick: PropTypes.func
};

ArticleActions.defaultProps = {
    onEditClick: null,
    onVisibilityClick: null
};

ArticleActions._handleArticleClick = (article, event) => {
    ArticleStore.onTrackClick(article.id);
    return event;
};

export default ArticleActions;
