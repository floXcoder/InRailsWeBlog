'use strict';

import {
    editArticle
} from '../../../actions';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleEditionDisplay from './inlineEdition';

@connect(null, {
    editArticle: editArticle
})
export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        articleDisplayMode: PropTypes.string.isRequired,
        articleEditionId: PropTypes.number,
        // From connect
        editArticle: PropTypes.func
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
        // TODO
        // ArticleActions.bookmarkArticle({article: article, isBookmarked: isBookmarked});
    };

    _handleEditClick = () => {
        this.props.editArticle(this.props.article.id);

        setTimeout(() => {
            $('html, body').animate({scrollTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top - 64}, 750);
        }, 300);
    };

    _handleVisibilityClick = (article) => {
        // TODO
    };

    render() {
        if (this.props.articleDisplayMode === 'edit' || this.props.articleEditionId === this.props.article.id) {
            return (
                <ArticleEditionDisplay article={this.props.article}/>
            );
        } else if (this.props.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay title={this.props.article.title}
                                      content={this.props.article.content}
                                      onEdit={this._handleEditClick}/>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    onBookmarkClick={this._handleBookmarkClick}
                                    onEdit={this._handleEditClick}
                                    onVisibilityClick={this._handleVisibilityClick}/>
            );
        } else {
            throw new Error('Article display mode unknown: ' + this.props.articleDisplayMode);
        }
    }
}
