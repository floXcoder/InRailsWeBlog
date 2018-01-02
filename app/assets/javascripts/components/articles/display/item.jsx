'use strict';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleEditionDisplay from './inlineEdition';

export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        articleDisplayMode: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // TODO : use spy methods
        // Tracker.trackViews($(ReactDOM.findDOMNode(this)), () => {
        //     ArticleActions.trackView(this.props.article.id);
        //     if (this.props.article.user) {
        //         UserActions.trackView(this.props.article.user.id);
        //     }
        //
        //     if (this.props.article.tags.length > 0) {
        //         TagActions.trackView(_.map(this.props.article.tags, 'id'));
        //     }
        // });
    }

    _handleBookmarkClick = (article, isBookmarked) => {
        // ArticleActions.bookmarkArticle({article: article, isBookmarked: isBookmarked});
    };

    _handleEditClick = (article) => {
    };

    _handleVisibilityClick = (article) => {
    };

    render() {
        if (this.props.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay title={this.props.article.title}
                                      content={this.props.article.content}/>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    onBookmarkClick={this._handleBookmarkClick}
                                    onEditClick={this._handleEditClick}
                                    onVisibilityClick={this._handleVisibilityClick}/>
            );
        } else if (this.props.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay article={this.props.article}/>
            );
        } else {
            throw new Error('Article display mode unknown: ' + this.props.articleDisplayMode);
        }
    }
}
