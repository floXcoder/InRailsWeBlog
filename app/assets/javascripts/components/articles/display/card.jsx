'use strict';

import {
    Link
} from 'react-router-dom';

import HighlightCode from 'highlight.js';

import {
    getArticleIsOutdated
} from '../../../selectors';

import CountCommentIcon from '../../comments/icons/count';
import ArticleActions from '../properties/actions';
import ArticleTags from '../properties/tags';
import ArticleTime from '../properties/time';

import UserAvatarIcon from '../../users/icons/avatar';

@connect((state, props) => ({
    isOutdated: getArticleIsOutdated(props.article)
}), {
})
export default class ArticleCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        onBookmarkClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,
        onVisibilityClick: PropTypes.func.isRequired,
        // From connect
        isOutdated: PropTypes.bool
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

    // TODO: use props directly
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
                            <Link to={`/article/${this.props.article.slug}`}
                                  onClick={this._handleArticleClick}>
                                {this.props.article.title}
                            </Link>
                        </h1>

                        <UserAvatarIcon user={this.props.article.user}
                                        className="article-user"/>

                        <div className="article-info right-align">
                            <ArticleTime lastUpdate={this.props.article.updatedAt}/>

                            <CountCommentIcon linkToComment={`/articles/${this.props.article.slug}`}
                                              commentsNumber={this.props.article.commentsNumber}/>
                        </div>
                    </div>

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                </div>

                <div className="card-action article-action clearfix">
                    <div className="row">

                        <div className="col s12 m12 l6 md-margin-bottom-20">
                            <ArticleTags articleId={this.props.article.id}
                                         tags={this.props.article.tags.toJS()}
                                         parentTags={this.props.article.parentTags.toJS()}
                                         childTags={this.props.article.childTags.toJS()}
                                         onClickTag={this._handleTagClick}/>
                        </div>

                        <div className="col s12 m12 l6 right-align">
                            <ArticleActions articleId={this.props.article.id}
                                            articleSlug={this.props.article.slug}
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
