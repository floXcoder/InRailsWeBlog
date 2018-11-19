'use strict';

import ArticleEditIcon from '../icons/edit';
import ArticleHistoryIcon from '../icons/history';
import ArticleLinkIcon from '../icons/link';
import ArticleVisibilityIcon from '../icons/visibility';
import ArticleBookmarkIcon from '../icons/bookmark';

export default class ArticleFloatingIcons extends React.PureComponent {
    static propTypes = {
        style: PropTypes.object.isRequired,
        className: PropTypes.string.isRequired,
        isSticky: PropTypes.bool.isRequired,
        userSlug: PropTypes.string.isRequired,
        articleId: PropTypes.number.isRequired,
        articleSlug: PropTypes.string.isRequired,
        articleTitle: PropTypes.string,
        articleVisibility: PropTypes.string,
        onVisibilityClick: PropTypes.func,
        display: PropTypes.oneOf(['list', 'item']),
        size: PropTypes.oneOf(['small', 'default', 'large']),
        color: PropTypes.oneOf(['primary', 'secondary', 'action']),
        isOwner: PropTypes.bool
    };

    static defaultProps = {
        display: 'list',
        size: 'default',
        color: 'action',
        isOwner: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {position, transform} = this.props.style;

        return (
            <div className={this.props.className}
                 style={{
                     position,
                     transform,
                     top: (this.props.style.top || 0) + 140,
                     left: 'inherit',
                     display: this.props.isSticky ? 'flex' : 'none'
                 }}>
                {
                    this.props.display === 'list' &&
                    <ArticleLinkIcon userSlug={this.props.userSlug}
                                     articleId={this.props.articleId}
                                     articleSlug={this.props.articleSlug}
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
                                     size={this.props.size}
                                     color={this.props.color}/>
                }

                {
                    this.props.isOwner &&
                    <ArticleVisibilityIcon articleId={this.props.articleId}
                                           articleVisibility={this.props.articleVisibility}
                                           onVisibilityClick={this.props.onVisibilityClick}
                                           size={this.props.size}
                                           color={this.props.color}/>
                }

                {
                    (this.props.display === 'item' && this.props.isOwner) &&
                    <ArticleHistoryIcon userSlug={this.props.userSlug}
                                        articleSlug={this.props.articleSlug}
                                        size={this.props.size}
                                        color={this.props.color}/>
                }
            </div>
        );
    }
}
