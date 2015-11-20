"use strict";

var HighlightCode = require('highlight.js');

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var ArticleHistory = require('./history');
var ArticleLinkIcon = require('./icons/link');
var ArticleVisibilityIcon = require('./icons/visibility');
var ArticleAuthorIcon = require('./icons/author');
var ArticleBookmarkIcon = require('./icons/bookmark');
var ArticleHistoryIcon = require('./icons/history');
var ArticleDeleteIcon = require('./icons/delete');
var ArticleTags = require('./properties/tags');
var ArticleTime = require('./properties/time');
var ArticleLink = require('./properties/link');

var ArticleShow = React.createClass({
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

    getInitialState: function () {
        return {
            articleVersions: null,
            isHistoryDisplayed: false
        };
    },

    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });
        this._highlightCode();
    },

    componentDidUpdate: function () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
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

    _showHistory: function () {
        if (this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false})
        } else {
            ArticleActions.loadArticleHistory({history: this.props.article.id});
        }

        this.state.isHistoryDisplayed = !this.state.isHistoryDisplayed;
    },

    onArticleChange: function (articleStore) {
        var newState = {};

        if (typeof(articleStore.articleVersions) !== 'undefined') {
            newState.articleVersions = articleStore.articleVersions;
            if (articleStore.articleVersions.length === 0) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }
        }

        if (typeof(articleStore.articleRestored) !== 'undefined') {
            newState.article = articleStore.articleRestored;
            Materialize.toast(I18n.t('js.article.history.restored'));
            this._showHistory();
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _onClickDelete: function (event) {
        event.preventDefault();
        ArticleActions.deleteArticles({id: this.props.article.id, showMode: true});
    },

    _onClickBookmark: function (articleId, event) {
        event.preventDefault();
        ArticleActions.bookmarkArticle({articleId: articleId});
    },

    _renderTitle: function () {
        if (!$.isEmpty(this.props.article.title) || !$.isEmpty(this.props.article.summary)) {
            return (
                <section className="card-title cd-intro">
                    <div className="cd-intro-content mask">
                        <h1 className="" data-content={this.props.article.title}>
                            <span>
                                {this.props.article.title}
                            </span>
                        </h1>

                        <div className="action-wrapper">
                            <p className="article-summary">
                                {this.props.article.summary}
                            </p>
                        </div>
                    </div>
                </section>
            );
        }
    },

    _renderEditIcon: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            return (
                <a className="article-icons tooltipped"
                   data-tooltip={I18n.t('js.article.tooltip.edit')}
                   href={"/articles/" + this.props.article.id + "/edit"}>
                    <i className="material-icons article-edit">mode_edit</i>
                </a>
            );
        }
    },

    _renderHistory: function () {
        if (this.state.isHistoryDisplayed) {
            return (
                <ArticleHistory articleVersions={this.state.articleVersions}/>
            );
        }
    },

    render: function () {
        return (
            <div>
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        {this._renderTitle()}
                        <span dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>
                    <div className="card-action article-action row clearfix">

                        <div className="col s12 m12 l6">
                            <ArticleTags article={this.props.article}/>
                        </div>
                        <div className="col s12 m12 l6 right-align">
                            <ArticleLinkIcon isLink={this.props.article.is_link}/>
                            <ArticleVisibilityIcon article={this.props.article}
                                                   userId={this.props.userId}/>
                            <ArticleBookmarkIcon article={this.props.article}
                                                 userId={this.props.userId}
                                                 onClickBookmark={this._onClickBookmark}/>
                            <ArticleHistoryIcon article={this.props.article}
                                                userId={this.props.userId}
                                                onClickHistory={this._showHistory}/>
                            {this._renderEditIcon()}
                            <ArticleDeleteIcon article={this.props.article}
                                               userId={this.props.userId}
                                               onClickDelete={this._onClickDelete}/>
                        </div>
                    </div>
                </div>

                {this._renderHistory()}
            </div>
        );
    }
});

module.exports = ArticleShow;
