'use strict';

import Hidden from '@material-ui/core/Hidden';

import ArticleDeleteIcon from '../icons/delete';
import ArticleTrackingIcon from '../icons/tracking';
import ArticleShareIcon from '../icons/share';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleHistoryIcon from '../icons/history';
import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

// import ArticleOutdatedIcon from '../icons/outdated';

const deleteIconStyle = {marginRight: 30};

const ArticleActions = ({classes, isInline, userSlug, articleId, articleSlug, articleTitle, articleVisibility, isOutdated, onOutdatedClick, onDeleteClick, size, color}) => (
    <ul className={classes.actionButtons}>
        {
            !isInline &&
            <li className={classes.actionItem}
                style={deleteIconStyle}>
                <ArticleDeleteIcon size={size}
                                   color={color}
                                   onDeleteClick={onDeleteClick}/>
            </li>
        }

        {
            !isInline &&
            <Hidden mdDown={true}>
                <li className={classes.actionItem}>
                    <ArticleTrackingIcon articleId={articleId}
                                         size={size}
                                         color={color}/>
                </li>
            </Hidden>
        }

        {
            (!isInline && articleVisibility !== 'everyone') &&
            <Hidden mdDown={true}>
                <li className={classes.actionItem}>
                    <ArticleShareIcon articleId={articleId}
                                      size={size}
                                      color={color}/>
                </li>
            </Hidden>
        }

        <li className={classes.actionItem}>
            <ArticleBookmarkIcon articleId={articleId}
                                 size={size}
                                 color={color}/>
        </li>

        {
            // !isInline &&
            // <Hidden mdDown={true}>
            //     <li className={classes.actionItem}>
            //         <ArticleOutdatedIcon articleId={articleId}
            //                              isOutdated={isOutdated}
            //                              onOutdatedClick={onOutdatedClick}
            //                              size={size}
            //                              color={color}/>
            //     </li>
            // </Hidden>
        }

        {
            (!isInline && userSlug) &&
            <Hidden mdDown={true}>
                <li className={classes.actionItem}>
                    <ArticleHistoryIcon userSlug={userSlug}
                                        articleSlug={articleSlug}
                                        size={size}
                                        color={color}/>
                </li>
            </Hidden>
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
