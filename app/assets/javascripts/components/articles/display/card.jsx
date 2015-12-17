'use strict';

var ArticleActions = require('../../../actions/articleActions');
var ArticleStore = require('../../../stores/articleStore');

var ArticleEditIcon = require('../icons/edit');
var ArticleLinkIcon = require('../icons/link');
var ArticleVisibilityIcon = require('../icons/visibility');
var ArticleAuthorIcon = require('../icons/author');
var ArticleBookmarkIcon = require('../icons/bookmark');
var ArticleCommentIcon = require('../icons/comment');
var ArticleTags = require('../properties/tags');
var ArticleTime = require('../properties/time');
var ArticleLink = require('../properties/link');

var FixedActionButton = require('../../materialize/fab');

var HighlightCode = require('highlight.js');

var ArticleCardDisplay = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        onClickEdit: React.PropTypes.func.isRequired,
        onClickBookmark: React.PropTypes.func.isRequired,
        onClickVisibility: React.PropTypes.func,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            onClickVisibility: null,
            currentUserId: null
        };
    },

    componentDidMount () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });
        this._highlightCode();
    },

    componentDidUpdate () {
        this._highlightCode();
    },

    _highlightCode () {
        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    _handleTagClick (tagId, tagName) {
        this.props.onClickTag(tagName);
    },

    _handleArticleClick (articleId, event) {
        ArticleStore.onTrackClick(articleId);
        return event;
    },

    render () {
        return (
            <div className="card blog-article-item clearfix">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            <a href={'/articles/' + this.props.article.slug}
                               onClick={this._handleArticleClick.bind(this, this.props.article.id)}>
                                {this.props.article.title}
                            </a>
                        </h1>
                        <ArticleAuthorIcon article={this.props.article}/>
                        <div className="article-info right-align">
                            <ArticleTime article={this.props.article}/>
                            <ArticleCommentIcon articleLink={'/articles/' + this.props.article.slug}
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
                            <FixedActionButton>
                                <ArticleLinkIcon isLink={this.props.article.is_link}/>
                                <ArticleBookmarkIcon article={this.props.article}
                                                     currentUserId={this.props.currentUserId}
                                                     onClickBookmark={this.props.onClickBookmark}/>
                                <ArticleVisibilityIcon article={this.props.article}
                                                       currentUserId={this.props.currentUserId}
                                                       onClickVisibility={this.props.onClickVisibility}/>
                                <ArticleEditIcon article={this.props.article}
                                                 currentUserId={this.props.currentUserId}
                                                 onClickEdit={this.props.onClickEdit}/>
                                <ArticleLink article={this.props.article}
                                             onArticleClick={this._handleArticleClick}/>
                            </FixedActionButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleCardDisplay;
