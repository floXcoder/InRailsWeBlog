'use strict';

import {
    withRouter
} from 'react-router-dom';

// TODO
// import Tracker from '../../../modules/tracker';
// import UserActions from '../../../actions/userActions';
// import TagActions from '../../../actions/tagActions';
// import ArticleActions from '../../../actions/articleActions';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleEditionDisplay from './inlineEdition';

@withRouter
export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
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

    _setDefaultDisplay = (tagName, event) => {
        event.preventDefault();
        this.setState({articleDisplayMode: this.props.initialDisplayMode});
    };

    _handleTagClick = (tagName) => {
        // TODO
        // this.props.history.push(`/article/tags/${tagName}`);

        // TODO
        // ArticleActions.loadArticles({tags: [tagName]});
    };

    _handleBookmarkClick = (articleId, isBookmarked) => {
        // TODO
        // ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    };

    render() {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay articleId={this.props.articleId}/>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay articleId={this.props.articleId}/>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay articleId={this.props.articleId}
                                       setDefaultDisplay={this._setDefaultDisplay}/>
            );
        } else {
            throw new Error('Article display mode unknown: ' + this.state.articleDisplayMode);
        }
    }
}
