'use strict';

import ArticleEditIcon from '../icons/edit';
// import ArticleHistoryIcon from '../icons/history';
import ArticleLinkIcon from '../icons/link';
import ArticleTopicLinkIcon from '../icons/topicLink';
import ArticleBookmarkIcon from '../icons/bookmark';


const ArticleFloatingIcons = function ({
                                           className,
                                           userSlug,
                                           articleId,
                                           articleSlug,
                                           articleUserId,
                                           articleTopicId,
                                           articleTitle,
                                           topicSlug,
                                           display = 'list',
                                           size = 'medium',
                                           color = 'action',
                                           isOwner = false,
                                           routeNavigate
                                       }) {
    return (
        <div className={className}>
            {
                display === 'list' &&
                <ArticleLinkIcon userSlug={userSlug}
                                 articleId={articleId}
                                 articleSlug={articleSlug}
                                 articleUserId={articleUserId}
                                 articleTopicId={articleTopicId}
                                 articleTitle={articleTitle}
                                 size="large"
                                 color={color}/>
            }

            <ArticleBookmarkIcon articleId={articleId}
                                 size={size}
                                 color={color}/>

            {
                !!isOwner &&
                <ArticleEditIcon userSlug={userSlug}
                                 articleSlug={articleSlug}
                                 routeNavigate={routeNavigate}
                                 size={size}
                                 color={color}/>
            }

            {
                !!topicSlug &&
                <ArticleTopicLinkIcon userSlug={userSlug}
                                      topicSlug={topicSlug}
                                      color={color}/>
            }

            {
                // (this.display === 'item' && this.isOwner) &&
                // <ArticleHistoryIcon userSlug={this.userSlug}
                //                     articleSlug={this.articleSlug}
                //                     size={this.size}
                //                     color={this.color}/>
            }
        </div>
    );
};

ArticleFloatingIcons.propTypes = {
    className: PropTypes.string.isRequired,
    userSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleUserId: PropTypes.number,
    articleTopicId: PropTypes.number,
    articleTitle: PropTypes.string,
    topicSlug: PropTypes.string,
    display: PropTypes.oneOf(['list', 'item']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
    routeNavigate: PropTypes.func,
    isOwner: PropTypes.bool
};

export default React.memo(ArticleFloatingIcons);
