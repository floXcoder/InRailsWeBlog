'use strict';

import ArticleStore from '../../../stores/articleStore';

import CountCommentIcon from '../../comments/icons/count';
import ArticleActions from '../properties/actions';
import ArticleTags from '../properties/tags';
import ArticleTime from '../properties/time';

import UserAvatarIcon from '../../users/icons/avatar';

import HighlightCode from 'highlight.js';

import {Link} from 'react-router-dom';

export default class ArticleCardDisplay extends React.Component {
    static propTypes = {
        children: PropTypes.string.isRequired,
        article: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        onBookmarkClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func,
        onVisibilityClick: PropTypes.func
    };

    static defaultProps = {
        onClickEdit: null,
        onClickVisibility: null
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

    _handleArticleClick= (event) => {
        ArticleStore.onTrackClick(this.props.article.id);

        return event;
    };

    render() {
        const isOutdated = this.props.article.outdated_number > 3;

        return (
            <div className={classNames('card blog-article-item clearfix', {'article-outdated': isOutdated})}>
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
                            <ArticleTime article={this.props.article}/>

                            <CountCommentIcon linkToComment={`/articles/${this.props.article.slug}`}
                                              commentsNumber={this.props.article.comments_number}/>
                        </div>
                    </div>

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>

                <div className="card-action article-action clearfix">
                    <div className="row">

                        <div className="col s12 m12 l6 md-margin-bottom-20">
                            <ArticleTags article={this.props.article}
                                         onClickTag={this._handleTagClick}/>
                        </div>

                        <div className="col s12 m12 l6 right-align">
                            <ArticleActions article={this.props.article}
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
