'use strict';

var ArticleEditIcon = require('../icons/edit');
var ArticleLinkIcon = require('../icons/link');
var ArticleVisibilityIcon = require('../icons/visibility');
var ArticleAuthorIcon = require('../icons/author');
var ArticleBookmarkIcon = require('../icons/bookmark');
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
        userId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            userId: null
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

    _handleTagClick (tagName, event) {
        this.props.onClickTag(tagName, event);
    },

    render () {
        return (
            <div className="card clearfix blog-article-item">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <ArticleAuthorIcon article={this.props.article}/>
                        <h1 className="article-title-card">
                            <a href={"/articles/" + this.props.article.slug}>
                                {this.props.article.title}
                            </a>
                        </h1>
                        <ArticleTime article={this.props.article}/>
                    </div>
                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
                <div className="card-action article-action row clearfix">
                    <div className="col s12 m12 l6">
                        <ArticleTags article={this.props.article}
                                     onClickTag={this._handleTagClick}/>
                    </div>
                    <div className="col s12 m12 l6 right-align">
                        <FixedActionButton>
                            <ArticleLinkIcon isLink={this.props.article.is_link}/>
                            <ArticleBookmarkIcon article={this.props.article}
                                                 userId={this.props.userId}
                                                 onClickBookmark={this.props.onClickBookmark}/>
                            <ArticleVisibilityIcon article={this.props.article}
                                                   userId={this.props.userId}
                                                   onClickVisibility={this.props.onClickVisibility}/>
                            <ArticleEditIcon article={this.props.article}
                                             userId={this.props.userId}
                                             onClickEdit={this.props.onClickEdit}/>
                            <ArticleLink article={this.props.article}/>
                        </FixedActionButton>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleCardDisplay;
