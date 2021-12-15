'use strict';

import ArticleEditIcon from '../icons/edit';
// import ArticleHistoryIcon from '../icons/history';
import ArticleLinkIcon from '../icons/link';
import ArticleTopicLinkIcon from '../icons/topicLink';
import ArticleBookmarkIcon from '../icons/bookmark';

export default class ArticleFloatingIcons extends React.PureComponent {
    static propTypes = {
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

    static defaultProps = {
        display: 'list',
        size: 'medium',
        color: 'action',
        isOwner: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                {
                    this.props.display === 'list' &&
                    <ArticleLinkIcon userSlug={this.props.userSlug}
                                     articleId={this.props.articleId}
                                     articleSlug={this.props.articleSlug}
                                     articleUserId={this.props.articleUserId}
                                     articleTopicId={this.props.articleTopicId}
                                     articleTitle={this.props.articleTitle}
                                     size="large"
                                     color={this.props.color}/>
                }

                <ArticleBookmarkIcon articleId={this.props.articleId}
                                     size={this.props.size}
                                     color={this.props.color}/>

                {
                    this.props.isOwner &&
                    <ArticleEditIcon userSlug={this.props.userSlug}
                                     articleSlug={this.props.articleSlug}
                                     routeNavigate={this.props.routeNavigate}
                                     size={this.props.size}
                                     color={this.props.color}/>
                }

                {
                    this.props.topicSlug &&
                    <ArticleTopicLinkIcon userSlug={this.props.userSlug}
                                          topicSlug={this.props.topicSlug}
                                          color={this.props.color}/>
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
    }
}
