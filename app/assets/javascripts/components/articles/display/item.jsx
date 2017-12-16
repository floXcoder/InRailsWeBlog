'use strict';

// TODO
// import Tracker from '../../../modules/tracker';
// import UserActions from '../../../actions/userActions';
// import TagActions from '../../../actions/tagActions';
// import ArticleActions from '../../../actions/articleActions';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleEditionDisplay from './inlineEdition';

export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        initialDisplayMode: PropTypes.string.isRequired
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    state = {
        articleDisplayMode: this.props.initialDisplayMode
    };

    componentDidMount() {
        // TODO
        // $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
        //     $(this).tooltip();
        // });

        // TODO : use mixin
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

    componentDidUpdate() {
        // TODO
        // $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
        //     $(this).tooltip();
        // });
    }

    _changeDefaultDisplay = (tagName, event) => {
        event.preventDefault();
        this.setState({articleDisplayMode: this.props.initialDisplayMode});
    };

    _handleBookmarkClick = (article, isBookmarked) => {
        // TODO
        // ArticleActions.bookmarkArticle({article: article, isBookmarked: isBookmarked});
    };

    _handleEditClick = (article) => {
        // TODO
    };

    _handleVisibilityClick = (article) => {
        // TODO
    };

    render() {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay title={this.props.article.title}
                                      content={this.props.article.content}/>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    onBookmarkClick={this._handleBookmarkClick}
                                    onEditClick={this._handleEditClick}
                                    onVisibilityClick={this._handleVisibilityClick}/>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay article={this.props.article}
                                       changeDefaultDisplay={this._changeDefaultDisplay}/>
            );
        } else {
            throw new Error('Article display mode unknown: ' + this.state.articleDisplayMode);
        }
    }
}
