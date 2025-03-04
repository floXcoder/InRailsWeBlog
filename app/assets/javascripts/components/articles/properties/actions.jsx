import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import ArticleDeleteIcon from '@js/components/articles/icons/delete';
import ArticleTrackingIcon from '@js/components/articles/icons/tracking';
import CheckLinkIcon from '@js/components/articles/icons/checkLink';
import ArticleShareIcon from '@js/components/articles/icons/share';
import ArticleBookmarkIcon from '@js/components/articles/icons/bookmark';
import ArticleHistoryIcon from '@js/components/articles/icons/history';
import ArticleEditIcon from '@js/components/articles/icons/edit';
import ArticleLinkIcon from '@js/components/articles/icons/link';
import ArticleArchiveIcon from '@js/components/articles/icons/archive';

// import ArticleOutdatedIcon from '@js/components/articles/icons/outdated';

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
                                     isArchived,
                                     hasLinks,
                                     onCheckLinkClick,
                                     onArchiveClick,
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
                (!isInline && !!userSlug) &&
                <li className="article-card-action-item">
                    <ArticleArchiveIcon isArchived={isArchived}
                                        size={size}
                                        color={color}
                                        onArchiveClick={onArchiveClick}/>
                </li>
            }

            {
                (!isInline && articleVisibility !== 'only_me') &&
                <Box sx={{
                    display: {
                        lg: 'block',
                        md: 'none'
                    }
                }}
                     component="li"
                     className="article-card-action-item">
                    <ArticleTrackingIcon articleId={articleId}
                                         size={size}
                                         color={color}/>
                </Box>
            }

            {
                !isInline && !!hasLinks &&
                <Box sx={{
                    display: {
                        lg: 'block',
                        md: 'none'
                    }
                }}
                     component="li"
                     className="article-card-action-item">
                    <CheckLinkIcon onCheckLinkClick={onCheckLinkClick}
                                   size={size}
                                   color={color}/>
                </Box>
            }

            {
                (!isInline && articleVisibility !== 'everyone') &&
                <Box sx={{
                    display: {
                        lg: 'block',
                        md: 'none'
                    }
                }}
                     component="li"
                     className="article-card-action-item">
                    <ArticleShareIcon articleId={articleId}
                                      size={size}
                                      color={color}/>
                </Box>
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
                <Box sx={{
                    display: {
                        lg: 'block',
                        md: 'none'
                    }
                }}
                     component="li"
                     className="article-card-action-item">
                    <ArticleHistoryIcon userSlug={userSlug}
                                        articleSlug={articleSlug}
                                        size={size}
                                        color={color}/>
                </Box>
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
    isArchived: PropTypes.bool,
    // isOutdated: PropTypes.bool,
    hasLinks: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

export default React.memo(ArticleActions);
