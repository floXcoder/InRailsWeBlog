'use strict';

import ArticleVisibilityIcon from '../icons/visibility';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleHistoryIcon from '../icons/history';
import ArticleDeleteIcon from '../icons/delete';
import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

import ArticleOutdatedIcon from '../icons/outdated';

const ArticleActions = ({isInline, articleId, articleSlug, articleTitle, articleVisibility, isOutdated, isBookmarked, onVisibilityClick, onOutdatedClick, onDeleteClick}) => (
    <ul className="action-icons">
        <li className="action-item">
            <ArticleBookmarkIcon articleId={articleId}/>
        </li>

        {
            !isInline &&
            <li className="action-item-divider"/>
        }

        {
            !isInline &&
            <li className="action-item">
                <ArticleOutdatedIcon articleId={articleId}
                                     isOutdated={isOutdated}
                                     onOutdatedClick={onOutdatedClick}/>
            </li>
        }

        {
            !isInline &&
            <li className="action-item-divider"/>
        }
        {
            !isInline &&
            <li className="action-item">
                <ArticleDeleteIcon onDeleteClick={onDeleteClick}/>
            </li>
        }

        <li className="action-item-divider"/>

        {
            !isInline &&
            <li className="action-item">
                <ArticleHistoryIcon articleSlug={articleSlug}/>
            </li>
        }

        <li className="action-item">
            <ArticleVisibilityIcon articleId={articleId}
                                   articleVisibility={articleVisibility}
                                   onVisibilityClick={onVisibilityClick}/>
        </li>

        <li className="action-item-divider"/>

        <li className="action-item">
            <ArticleEditIcon articleSlug={articleSlug}/>
        </li>

        {
            isInline &&
            <li className="action-item">
                <ArticleLinkIcon articleId={articleId}
                                 articleSlug={articleSlug}
                                 articleTitle={articleTitle}/>
            </li>
        }
    </ul>
);

ArticleActions.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    articleTitle: PropTypes.string,
    onVisibilityClick: PropTypes.func,
    onOutdatedClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    isInline: PropTypes.bool,
    isOutdated: PropTypes.bool,
    isBookmarked: PropTypes.bool
};

ArticleActions.defaultProps = {
    isInline: false,
    isOutdated: false,
    isBookmarked: false
};

export default ArticleActions;
