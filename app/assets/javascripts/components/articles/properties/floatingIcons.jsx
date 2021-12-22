'use strict';

import ArticleEditIcon from '../icons/edit';
// import ArticleHistoryIcon from '../icons/history';
import ArticleLinkIcon from '../icons/link';
import ArticleTopicLinkIcon from '../icons/topicLink';
import ArticleBookmarkIcon from '../icons/bookmark';


const ArticleFloatingIcons = function (props) {
    return (
        <div className={props.className}>
            {
                props.display === 'list' &&
                <ArticleLinkIcon userSlug={props.userSlug}
                                 articleId={props.articleId}
                                 articleSlug={props.articleSlug}
                                 articleUserId={props.articleUserId}
                                 articleTopicId={props.articleTopicId}
                                 articleTitle={props.articleTitle}
                                 size="large"
                                 color={props.color}/>
            }

            <ArticleBookmarkIcon articleId={props.articleId}
                                 size={props.size}
                                 color={props.color}/>

            {
                props.isOwner &&
                <ArticleEditIcon userSlug={props.userSlug}
                                 articleSlug={props.articleSlug}
                                 routeNavigate={props.routeNavigate}
                                 size={props.size}
                                 color={props.color}/>
            }

            {
                props.topicSlug &&
                <ArticleTopicLinkIcon userSlug={props.userSlug}
                                      topicSlug={props.topicSlug}
                                      color={props.color}/>
            }

            {
                // (this.props.display === 'item' && this.props.isOwner) &&
                // <ArticleHistoryIcon userSlug={this.props.userSlug}
                //                     articleSlug={this.props.articleSlug}
                //                     size={this.props.size}
                //                     color={this.props.color}/>
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

ArticleFloatingIcons.defaultProps = {
    display: 'list',
    size: 'medium',
    color: 'action',
    isOwner: false
};

export default React.memo(ArticleFloatingIcons);
