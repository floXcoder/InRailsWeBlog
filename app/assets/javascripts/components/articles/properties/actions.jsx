'use strict';

import ArticleVisibilityIcon from '../icons/visibility';
import ArticleShareIcon from '../icons/share';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleHistoryIcon from '../icons/history';
import ArticleDeleteIcon from '../icons/delete';
import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

import ArticleOutdatedIcon from '../icons/outdated';

const ArticleActions = ({classes, isInline, userSlug, articleId, articleSlug, articleTitle, articleVisibility, isOutdated, onVisibilityClick, onOutdatedClick, onDeleteClick, size, color}) => (
    <ul className={classes.actionButtons}>
        {
            !isInline &&
            <li className={classes.actionItem}
                style={{marginRight: 30}}>
                <ArticleDeleteIcon size={size}
                                   color={color}
                                   onDeleteClick={onDeleteClick}/>
            </li>
        }

        {
            articleVisibility !== 'everyone' &&
            <li className={classes.actionItem}>
                <ArticleShareIcon articleId={articleId}
                                  size={size}
                                  color={color}/>
            </li>
        }

        <li className={classes.actionItem}>
            <ArticleBookmarkIcon articleId={articleId}
                                 size={size}
                                 color={color}/>
        </li>

        {
            !isInline &&
            <li className={classes.actionItem}>
                <ArticleOutdatedIcon articleId={articleId}
                                     isOutdated={isOutdated}
                                     onOutdatedClick={onOutdatedClick}
                                     size={size}
                                     color={color}/>
            </li>
        }

        <li className={classes.actionItem}>
            <ArticleVisibilityIcon articleVisibility={articleVisibility}
                                   onVisibilityClick={onVisibilityClick}
                                   size={size}
                                   color={color}/>
        </li>

        {
            (!isInline && userSlug) &&
            <li className={classes.actionItem}>
                <ArticleHistoryIcon userSlug={userSlug}
                                    articleSlug={articleSlug}
                                    size={size}
                                    color={color}/>
            </li>
        }

        {
            userSlug &&
            <li className={classes.actionItem}>
                <ArticleEditIcon userSlug={userSlug}
                                 articleSlug={articleSlug}
                                 size={size}
                                 color={color}/>
            </li>
        }

        {
            (isInline && userSlug) &&
            <li className={classes.actionItem}>
                <ArticleLinkIcon articleId={articleId}
                                 articleSlug={articleSlug}
                                 articleTitle={articleTitle}
                                 userSlug={userSlug}
                                 size={size}
                                 color={color}/>
            </li>
        }
    </ul>
);

ArticleActions.propTypes = {
    classes: PropTypes.object.isRequired,
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    userSlug: PropTypes.string,
    articleTitle: PropTypes.string,
    onVisibilityClick: PropTypes.func,
    onOutdatedClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    isInline: PropTypes.bool,
    isOutdated: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

ArticleActions.defaultProps = {
    isInline: false,
    isOutdated: false,
    size: 'default',
    color: 'action'
};

export default React.memo(ArticleActions);
