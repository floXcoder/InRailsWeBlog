var ArticleActions = require('../../actions/articleActions');
var ArticleCardDisplay = require('./display/card');
var ArticleInlineDisplay = require('./display/inline');
var ArticleEditionDisplay = require('./display/edition');

var HighlightCode = require('highlight.js');

var ArticleItem = React.createClass({
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
            articleDisplayMode: this.props.articleDisplayMode
        };
    },

    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
    },

    componentDidUpdate: function () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
    },

    _setDefaultDisplay: function (tagName, event) {
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _onClickTag: function (tagName, event) {
        ArticleActions.loadArticles({tags: [tagName]});
    },

    _onClickBookmark: function (articleId, event) {
        ArticleActions.bookmarkArticle({articleId: articleId});
    },

    _onClickEdit: function (event) {
        require.ensure([], () => {
            require('../../wysiwyg/summernote');
            require('../../wysiwyg/lang/summernote-en-US');
            require('../../wysiwyg/lang/summernote-fr-FR');

            $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
                $(this).tooltip('remove');
            });
            this.setState({articleDisplayMode: 'edit'});
        });
    },

    render: function () {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay article={this.props.article}
                                      userId={this.props.userId}>
                    {this.props.children}
                </ArticleInlineDisplay>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    userId={this.props.userId}
                                    onClickTag={this._onClickTag}
                                    onClickEdit={this._onClickEdit}
                                    onClickBookmark={this._onClickBookmark}>
                    {this.props.children}
                </ArticleCardDisplay>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay article={this.props.article}
                                       userId={this.props.userId}
                                       onClickTag={this._onClickTag}
                                       setDefaultDisplay={this._setDefaultDisplay}>
                    {this.props.children}
                </ArticleEditionDisplay>
            );
        } else {
            log.info('Article display mode unknown: ' + this.state.articleDisplayMode);
            return null;
        }
    }
});

module.exports = ArticleItem;
