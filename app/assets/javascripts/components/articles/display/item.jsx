'use strict';

import Tracker from '../../../modules/tracker';
import UserActions from '../../../actions/userActions';
import TagActions from '../../../actions/tagActions';
import ArticleActions from '../../../actions/articleActions';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleEditionDisplay from './inline-edition';

export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired,
        initialDisplayMode: React.PropTypes.string.isRequired
    };

    static defaultProps = {};

    state = {
        articleDisplayMode: this.props.initialDisplayMode
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });

        Tracker.trackViews($(ReactDOM.findDOMNode(this)), () => {
            ArticleActions.trackView(this.props.article.id);
            if (this.props.article.user) {
                UserActions.trackView(this.props.article.user.id);
            }

            if (this.props.article.tags.length > 0) {
                TagActions.trackView(_.map(this.props.article.tags, 'id'));
            }
        });
    }

    componentDidUpdate() {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });
    }

    _setDefaultDisplay = (tagName, event) => {
        event.preventDefault();
        this.setState({articleDisplayMode: this.props.initialDisplayMode});
    };

    _handleTagClick = (tagName) => {
        this.props.router.history.push(`/article/tags/${tagName}`);

        ArticleActions.loadArticles({tags: [tagName]});
    };

    _handleBookmarkClick = (articleId, isBookmarked) => {
        ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    };

    render() {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay article={this.props.article}>
                    {this.props.children}
                </ArticleInlineDisplay>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    onTagClick={this._handleTagClick}
                                    onBookmarkClick={this._handleBookmarkClick}>
                    {this.props.children}
                </ArticleCardDisplay>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay article={this.props.article}
                                       onTagClick={this._handleTagClick}
                                       setDefaultDisplay={this._setDefaultDisplay}>
                    {this.props.children}
                </ArticleEditionDisplay>
            );
        } else {
            log.error('Article display mode unknown: ' + this.state.articleDisplayMode);
            return null;
        }
    }
}
