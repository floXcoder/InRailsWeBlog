'use strict';

import ArticleVisibilityIcon from '../icons/visibility';
import ArticleHistoryIcon from '../icons/history';
import ArticleDeleteIcon from '../icons/delete';
import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

const ArticleActions = ({isInline, articleId, articleSlug, articleVisibility, onVisibilityClick, onDeleteClick}) => (
    <ul className="action-icons">
        {
            !isInline &&
            <li className="action-item">
                <ArticleDeleteIcon onDeleteClick={onDeleteClick}/>
            </li>
        }

        {
            !isInline &&
            <li className="action-item">
                <ArticleHistoryIcon articleSlug={articleSlug}/>
            </li>
        }

        <li className="action-item">
            <ArticleVisibilityIcon articleId={articleId}
                                   articleVisibility={articleVisibility}/>
        </li>

        <li className="action-item">
            <ArticleEditIcon articleSlug={articleSlug}/>
        </li>

        {
            isInline &&
            <li className="action-item">
                <ArticleLinkIcon articleSlug={articleSlug}
                                 articleId={articleId}/>
            </li>
        }
    </ul>
);

ArticleActions.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    onVisibilityClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    isInline: PropTypes.bool
};

ArticleActions.defaultProps = {
    isInline: false
};

export default ArticleActions;
