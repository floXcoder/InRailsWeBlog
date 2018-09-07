'use strict';

import ArticleEditIcon from '../icons/edit';
import ArticleLinkIcon from '../icons/link';

export default class ArticleFloatingIcons extends React.Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        isOwner: PropTypes.bool.isRequired,
        isSticky: PropTypes.bool.isRequired,
        articleId: PropTypes.number.isRequired,
        articleSlug: PropTypes.string.isRequired,
        articleTitle: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="article-floating-icon"
                 style={{
                     ...this.props.style,
                     top: (this.props.style.top || 0) + 80,
                     display: this.props.isSticky ? 'block' : 'none'
                 }}>
                {
                    this.props.isOwner &&
                    <ArticleEditIcon articleSlug={this.props.articleSlug}/>
                }

                <ArticleLinkIcon articleId={this.props.articleId}
                                 articleSlug={this.props.articleSlug}
                                 articleTitle={this.props.articleTitle}/>
            </div>
        );
    }
}
