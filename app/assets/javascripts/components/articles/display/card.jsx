'use strict';

import {
    connect
} from 'react-redux';

import {
    Link
} from 'react-router-dom';

import HighlightCode from 'highlight.js';

import {
    // onTagClick,
    // onBookmarkClick,
    // onEditClick,
    // onVisibilityClick
} from '../../../actions/index';

import {
    getArticleIsOutdated,
    getArticleSlug,
    getArticleTitle,
    getArticleContent,
    getArticleUpdatedAt,
    getArticleCommentsNumber,
    getArticleUser,
} from '../../../selectors/articleSelectors';

import CountCommentIcon from '../../comments/icons/count';
import ArticleActions from '../properties/actions';
import ArticleTags from '../properties/tags';
import ArticleTime from '../properties/time';

import UserAvatarIcon from '../../users/icons/avatar';

@connect((state, props) => ({
    slug: getArticleSlug(state.articleState, props.articleId),
    title: getArticleTitle(state.articleState, props.articleId),
    content: getArticleContent(state.articleState, props.articleId),
    updatedAt: getArticleUpdatedAt(state.articleState, props.articleId),
    isOutdated: getArticleIsOutdated(state.articleState, props.articleId),
    commentsNumber: getArticleCommentsNumber(state.articleState, props.articleId),
    user: getArticleUser(state.articleState, props.articleId)
}), {
    // onTagClick,
    // onBookmarkClick,
    // onEditClick,
    // onVisibilityClick
})
export default class ArticleCardDisplay extends React.Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,

        onTagClick: PropTypes.func,
        onBookmarkClick: PropTypes.func,
        onEditClick: PropTypes.func,
        onVisibilityClick: PropTypes.func,

        slug: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        updatedAt: PropTypes.string,
        isOutdated: PropTypes.bool,
        commentsNumber: PropTypes.number,
        user: PropTypes.object,

    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });

        this._highlightCode();
    }

    componentDidUpdate() {
        this._highlightCode();
    }

    _highlightCode = () => {
        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    };

    _handleTagClick = (tagId, tagName) => {
        this.props.onTagClick(tagName);
    };

    _handleArticleClick = (event) => {
        // TODO
        // ArticleStore.onTrackClick(this.props.article.id);

        return event;
    };

    render() {
        return (
            <div className={classNames('card blog-article-item clearfix', {'article-outdated': this.props.isOutdated})}>
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            <Link to={`/article/${this.props.slug}`}
                                  onClick={this._handleArticleClick}>
                                {this.props.title}
                            </Link>
                        </h1>

                        <UserAvatarIcon user={this.props.user}
                                        className="article-user"/>

                        <div className="article-info right-align">
                            <ArticleTime lastUpdate={this.props.updatedAt}/>

                            <CountCommentIcon linkToComment={`/articles/${this.props.slug}`}
                                              commentsNumber={this.props.commentsNumber}/>
                        </div>
                    </div>

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.content}}/>
                </div>

                <div className="card-action article-action clearfix">
                    <div className="row">

                        <div className="col s12 m12 l6 md-margin-bottom-20">
                            <ArticleTags articleId={this.props.articleId}
                                         onClickTag={this._handleTagClick}/>
                        </div>

                        <div className="col s12 m12 l6 right-align">
                            <ArticleActions articleId={this.props.articleId}
                                            articleSlug={this.props.slug}
                                            onEditClick={this.props.onEditClick}
                                            onBookmarkClick={this.props.onBookmarkClick}
                                            onVisibilityClick={this.props.onVisibilityClick}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
