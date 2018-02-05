'use strict';

import {
    inlineEditArticle
} from '../../../actions';

import {
    getArticleIsOwner,
    getArticleIsOutdated
} from '../../../selectors';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleInlineEditionDisplay from './inlineEdition';

@connect((state, props) => ({
    isOwner: getArticleIsOwner(state, props.article),
    isOutdated: getArticleIsOutdated(props.article)
}), {
    inlineEditArticle
})
export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        articleDisplayMode: PropTypes.string.isRequired,
        articleEditionId: PropTypes.number,
        // From connect
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool,
        inlineEditArticle: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleInlineEditClick = () => {
        this.props.inlineEditArticle(this.props.article.id);
    };

    _handleBookmarkClick = (article, isBookmarked) => {
        // TODO
        // ArticleActions.bookmarkArticle({article: article, isBookmarked: isBookmarked});
    };

    _handleVisibilityClick = (article) => {
        // TODO
    };

    render() {
        if (this.props.articleDisplayMode === 'edit' || this.props.articleEditionId === this.props.article.id) {
            return (
                <ArticleInlineEditionDisplay article={this.props.article}
                                             isOwner={this.props.isOwner}/>
            );
        } else if (this.props.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay id={this.props.article.id}
                                      title={this.props.article.title}
                                      content={this.props.article.content}
                                      slug={this.props.article.slug}
                                      isOwner={this.props.isOwner}
                                      onInlineEdit={this._handleInlineEditClick}/>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    isOwner={this.props.isOwner}
                                    isOutdated={this.props.isOutdated}
                                    onBookmarkClick={this._handleBookmarkClick}
                                    onInlineEdit={this._handleInlineEditClick}
                                    onVisibilityClick={this._handleVisibilityClick}/>
            );
        } else {
            throw new Error('Article display mode unknown: ' + this.props.articleDisplayMode);
        }
    }
}
