'use strict';

import Hidden from '@mui/material/Hidden';

import ArticleDeleteIcon from '../icons/delete';
import ArticleTrackingIcon from '../icons/tracking';
import CheckLinkIcon from '../icons/checkLink';
import ArticleShareIcon from '../icons/share';
import ArticleBookmarkIcon from '../icons/bookmark';
import ArticleHistoryIcon from '../icons/history';
import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

// import ArticleOutdatedIcon from '../icons/outdated';

const deleteIconStyle = {
    marginRight: 30
};

const ArticleActions = function ({
                                     isInline = false,
                                     userSlug,
                                     articleId,
                                     articleSlug,
                                     articleUserId,
                                     articleTopicId,
                                     articleTitle,
                                     articleVisibility,
                                     hasLinks,
                                     onCheckLinkClick,
                                     onDeleteClick,
                                     size = 'medium',
                                     color = 'action'
                                 }) {
    return (
        <ul className="article-card-action-buttons">
            {
                !isInline &&
                <li className="article-card-action-item"
                    style={deleteIconStyle}>
                    <ArticleDeleteIcon size={size}
                                       color="action"
                                       onDeleteClick={onDeleteClick}/>
                </li>
            }

            {
                (!isInline && articleVisibility !== 'only_me') &&
                <Hidden lgDown={true}>
                    <li className="article-card-action-item">
                        <ArticleTrackingIcon articleId={articleId}
                                             size={size}
                                             color={color}/>
                    </li>
                </Hidden>
            }

            {
                !isInline && !!hasLinks &&
                <Hidden lgDown={true}>
                    <li className="article-card-action-item">
                        <CheckLinkIcon onCheckLinkClick={onCheckLinkClick}
                                       size={size}
                                       color={color}/>
                    </li>
                </Hidden>
            }

            {
                (!isInline && articleVisibility !== 'everyone') &&
                <Hidden lgDown={true}>
                    <li className="article-card-action-item">
                        <ArticleShareIcon articleId={articleId}
                                          size={size}
                                          color={color}/>
                    </li>
                </Hidden>
            }

            <li className="article-card-action-item">
                <ArticleBookmarkIcon articleId={articleId}
                                     size={size}
                                     color={color}/>
            </li>

            {
                // !isInline &&
                // <Hidden mdDown={true}>
                //     <li className={article-card-actionItem}>
                //         <ArticleOutdatedIcon isOutdated={isOutdated}
                //                              onOutdatedClick={onOutdatedClick}
                //                              size={size}
                //                              color={color}/>
                //     </li>
                // </Hidden>
            }

            {
                !!(!isInline && userSlug) &&
                <Hidden lgDown={true}>
                    <li className="article-card-action-item">
                        <ArticleHistoryIcon userSlug={userSlug}
                                            articleSlug={articleSlug}
                                            size={size}
                                            color={color}/>
                    </li>
                </Hidden>
            }

            {
                !!userSlug &&
                <li className="article-card-action-item">
                    <ArticleEditIcon userSlug={userSlug}
                                     articleSlug={articleSlug}
                                     size={size}
                                     color={color}/>
                </li>
            }

            {
                !!(isInline && userSlug) &&
                <li className="article-card-action-item">
                    <ArticleLinkIcon articleId={articleId}
                                     articleSlug={articleSlug}
                                     articleTitle={articleTitle}
                                     articleUserId={articleUserId}
                                     articleTopicId={articleTopicId}
                                     userSlug={userSlug}
                                     size={size}
                                     color={color}/>
                </li>
            }
        </ul>
    );
};

ArticleActions.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    userSlug: PropTypes.string,
    articleUserId: PropTypes.number,
    articleTopicId: PropTypes.number,
    articleTitle: PropTypes.string,
    // onOutdatedClick: PropTypes.func,
    onCheckLinkClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    isInline: PropTypes.bool,
    // isOutdated: PropTypes.bool,
    hasLinks: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

export default React.memo(ArticleActions);
