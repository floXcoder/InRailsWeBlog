"use strict";

var ArticleEditIcon = require('../icons/edit');
var ArticleLinkIcon = require('../icons/link');
var ArticleVisibilityIcon = require('../icons/visibility');
var ArticleAuthorIcon = require('../icons/author');
var ArticleBookmarkIcon = require('../icons/bookmark');
var ArticleTags = require('../properties/tags');
var ArticleTime = require('../properties/time');
var ArticleLink = require('../properties/link');

var HighlightCode = require('highlight.js');

var ArticleCardDisplay = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        onClickBookmark: React.PropTypes.func.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

    componentDidMount: function () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });
        this._highlightCode();
    },

    componentDidUpdate: function () {
        this._highlightCode();
    },

    _highlightCode: function () {
        var domNode = ReactDOM.findDOMNode(this);
        var nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    _onClickTag: function (tagName, event) {
        this.props.onClickTag(tagName, event);
    },

    render: function () {
        return (
            <div className="card clearfix blog-article-item">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            <a href={"/articles/" + this.props.article.slug}>
                                {this.props.article.title}
                            </a>
                        </h1>
                        <ArticleTime article={this.props.article}/>
                    </div>
                    <div dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
                <div className="card-action article-action row clearfix">
                    <div className="col s12 m12 l6">
                        <ArticleTags article={this.props.article}
                                     onClickTag={this._onClickTag}/>
                    </div>
                    <div className="col s12 m12 l6 right-align">
                        <ArticleEditIcon article={this.props.article}
                                         userId={this.props.userId}
                                         onClickEdit={this.props.onClickEdit}/>
                        <ArticleLinkIcon isLink={this.props.article.is_link}/>
                        <ArticleVisibilityIcon article={this.props.article}
                                               userId={this.props.userId}/>
                        <ArticleAuthorIcon article={this.props.article}/>
                        <ArticleBookmarkIcon article={this.props.article}
                                             userId={this.props.userId}
                                             onClickBookmark={this.props.onClickBookmark}/>
                        <ArticleLink article={this.props.article}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleCardDisplay;
