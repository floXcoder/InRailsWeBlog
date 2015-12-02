'use strict';

var HighlightCode = require('highlight.js');
var AnimatedText = require('../modules/animatedText');

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var ArticleHistory = require('./history');
var ArticleLinkIcon = require('./icons/link');
var ArticleVisibilityIcon = require('./icons/visibility');
var ArticleBookmarkIcon = require('./icons/bookmark');
var ArticleHistoryIcon = require('./icons/history');
var ArticleDeleteIcon = require('./icons/delete');
var ArticleTags = require('./properties/tags');

var ArticleShow = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number
    },

    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    getDefaultProps () {
        return {
            userId: null
        };
    },

    getInitialState () {
        return {
            articleVersions: null,
            isHistoryDisplayed: false
        };
    },

    componentDidMount () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });
        this._highlightCode();
    },

    componentDidUpdate () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });
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

    onArticleChange (articleStore) {
        let newState = {};

        if (typeof(articleStore.articleVersions) !== 'undefined') {
            newState.articleVersions = articleStore.articleVersions;
            if (articleStore.articleVersions.length === 0
                || (articleStore.articleVersions.length === 1 && articleStore.articleVersions[0].article.content === '')) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }
        }

        if (typeof(articleStore.articleRestored) !== 'undefined') {
            newState.article = articleStore.articleRestored;
            Materialize.toast(I18n.t('js.article.history.restored'));
            this._handleHistoryClick();
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleHistoryClick () {
        if (this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false})
        } else {
            ArticleActions.loadArticleHistory({history: this.props.article.id});
        }

        this.state.isHistoryDisplayed = !this.state.isHistoryDisplayed;
    },

    _handleDeleteClick (event) {
        event.preventDefault();
        ArticleActions.deleteArticles({id: this.props.article.id, showMode: true});
    },

    _handleBookmarkClick (articleId, event) {
        event.preventDefault();
        ArticleActions.bookmarkArticle({articleId: articleId});
    },

    _renderTitle () {
        if (!$.isEmpty(this.props.article.title) || !$.isEmpty(this.props.article.summary)) {
            return (
                <AnimatedText title={this.props.article.title}
                              subtitle={this.props.article.summary}/>
            );
        }
    },

    _renderEditIcon () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            return (
                <a className="article-edit btn-floating tooltipped"
                   data-tooltip={I18n.t('js.article.tooltip.edit')}
                   href={"/articles/" + this.props.article.id + "/edit"}>
                    <i className="material-icons">mode_edit</i>
                </a>
            );
        }
    },

    _renderHistory () {
        if (this.state.isHistoryDisplayed) {
            return (
                <ArticleHistory articleVersions={this.state.articleVersions}/>
            );
        }
    },

    render () {
        return (
            <div>
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        {this._renderTitle()}
                        <span className="blog-article-content"
                              dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>
                    <div className="card-action article-action row clearfix">

                        <div className="col s12 m12 l6">
                            <ArticleTags article={this.props.article}/>
                        </div>
                        <div className="col s12 m12 l6 right-align">
                            <ArticleDeleteIcon article={this.props.article}
                                               userId={this.props.userId}
                                               onClickDelete={this._handleDeleteClick}/>
                            <ArticleBookmarkIcon article={this.props.article}
                                                 userId={this.props.userId}
                                                 onClickBookmark={this._handleBookmarkClick}/>
                            <ArticleLinkIcon isLink={this.props.article.is_link}/>
                            <ArticleVisibilityIcon article={this.props.article}
                                                   userId={this.props.userId}/>
                            <ArticleHistoryIcon article={this.props.article}
                                                userId={this.props.userId}
                                                onClickHistory={this._handleHistoryClick}/>
                            {this._renderEditIcon()}
                        </div>
                    </div>
                </div>

                {this._renderHistory()}
            </div>
        );
    }
});

module.exports = ArticleShow;
