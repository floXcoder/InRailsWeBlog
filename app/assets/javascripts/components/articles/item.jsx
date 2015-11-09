var ArticleActions = require('../../actions/articleActions');

require('../../wysiwyg/summernote');
require('../../wysiwyg/lang/summernote-fr-FR');

var HighlightCode = require('highlight.js');

var ArticleItem = React.createClass({
    getInitialState: function () {
        return {
            editor: null,
            articleDisplayMode: this.props.articleDisplayMode,
            isLink: this.props.article.is_link || false,
            isBookmarked: this.props.article.is_bookmarked || false
        };
    },

    componentDidMount: function () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });

        this._highlightCode();
    },

    componentDidUpdate: function () {
        if (this.state.articleDisplayMode === 'edit') {
            this.state.editor = $("#editor-summernote-" + this.props.article.id);

            var airToolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['undo', ['undo', 'redo']],
                ['view', ['fullscreen', 'codeview']],
                ['para', ['ul', 'ol']],
                ['insert', ['link', 'picture', 'video']]
            ];

            this.state.editor.summernote({
                airMode: true,
                airToolbar: airToolbar,
                lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
                callbacks: {
                    onKeyup: function (event) {
                        this._handleChange(event);
                    }.bind(this)
                }
            });
        } else {
            this._highlightCode();
        }
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

    _handleChange: function (event) {
        var text = event.currentTarget.textContent;

        if ($.isURL(text.trim()) && !this.state.isLink) {
            this.state.isLink = true;
            this.setState({isLink: true});
            this.state.editor.summernote('code', '');
            this.state.editor.summernote("createLink", {
                text: text.trim(),
                url: text.trim(),
                isNewWindow: true
            });
        } else if (this.state.isLink && !$.isURL(text.trim())) {
            this.state.isLink = false;
            this.setState({isLink: false});
        }
    },

    _onClickTag: function (tagName, event) {
        ArticleActions.loadArticles({tags: [tagName]});
    },

    _onClickBookmark: function (articleId, event) {
        ArticleActions.bookmarkArticle({articleId: articleId});
        this.setState({isBookmarked: !this.state.isBookmarked});
    },

    _onEditClick: function (event) {
        this.setState({articleDisplayMode: 'edit'});
    },

    _onDeleteClick: function (event) {
        this.state.editor.summernote('destroy');
        ArticleActions.deleteArticles({id: this.props.article.id});
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _onCancelClick: function (event) {
        this.state.editor.summernote('destroy');
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _onSaveClick: function (event) {
        var content = this.state.editor.summernote('code');
        ArticleActions.updateArticles({id: this.props.article.id, content: content});

        this.state.editor.summernote('destroy');
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _renderEditIcon: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            return (
                <div className="article-icons tooltipped"
                     data-tooltip={I18n.t('js.article.tooltip.edit')}
                     onClick={this._onEditClick} >
                    <i className="material-icons article-edit">mode_edit</i>
                </div>
            );
        }
    },

    _renderEditionIcons: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            $('.article-edition .article-icons.tooltipped').tooltip('remove');
            return (
                <div className="article-icons">
                    <i className="material-icons article-delete"
                       onClick={this._onDeleteClick}>
                        delete
                    </i>
                    <i className="material-icons article-cancel"
                       onClick={this._onCancelClick}>
                        clear
                    </i>
                    <i className="material-icons article-update"
                       onClick={this._onSaveClick} >
                        check
                    </i>
                </div>
            );
        }
    },

    _renderTime: function () {
        return (
            <div className="article-icons tooltipped article-time"
                 data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
                {this.props.article.updated_at}
            </div>
        );
    },

    _renderGotoArticle: function () {
        return (
            <a className="article-icons article-goto"
               href={"/articles/" + this.props.article.slug} >
                <i className="material-icons">forward</i>
            </a>
        );
    },

    _renderIsLinkIcon: function () {
        if (this.state.isLink) {
            return (
                <div className="article-icons tooltipped"
                     data-tooltip={I18n.t('js.article.tooltip.link')}>
                    <i className="material-icons article-link">link</i>
                </div>
            );
        } else {
            return null;
        }
    },

    _renderVisibilityIcon: function () {
        if (this.props.userId) {
            var viabilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: I18n.t('js.article.visibility.enum.' + this.props.article.visibility)});

            if (this.props.article.visibility === 'everyone') {
                return (
                    <div className="article-icons tooltipped" data-tooltip={viabilityTooltip}>
                        <i className="material-icons article-public">visibility</i>
                    </div>
                );
            } else {
                return (
                    <div className="article-icons tooltipped" data-tooltip={viabilityTooltip}>
                        <i className="material-icons article-private">visibility_off</i>
                    </div>
                );
            }
        }
    },

    _renderAuthorIcon: function () {
        return (
            <div className="article-icons">
                <i className="material-icons">account_circle</i>
                {this.props.article.author.pseudo}
            </div>
        );
    },

    _renderBookmarkIcon: function () {
        var bookmarkClass = "material-icons" + (this.state.isBookmarked ? " article-bookmarked" : '');
        return (
            <div className="article-icons"
                 onClick={this._onClickBookmark.bind(this, this.props.article.id)} >
                <i className={bookmarkClass} >bookmark</i>
            </div>
        );
    },

    render: function () {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <div className="blog-article-item">
                    <h4 className="article-title-inline">
                        {this.props.article.title}
                    </h4>
                    <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            var childTags = _.indexBy(this.props.article.child_tags, 'id');
            var parentTags = _.indexBy(this.props.article.parent_tags, 'id');

            var Tags = this.props.article.tags.map(function (tag) {
                var relationshipClass = '';
                if (parentTags[tag.id]) {
                    relationshipClass = 'tag-parent';
                } else if (childTags[tag.id]) {
                    relationshipClass = 'tag-child';
                }

                return (
                    <a key={tag.id}
                       onClick={this._onClickTag.bind(this, tag.name)}
                       className={"waves-effect waves-light btn-small article-tag " + relationshipClass}>
                        {tag.name}
                    </a>
                );
            }.bind(this));

            return (
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        <div className="card-title article-title center clearfix">
                            <h1 className="article-title-card">
                                <a href={"/articles/" + this.props.article.slug}>
                                    {this.props.article.title}
                                </a>
                            </h1>
                            {this._renderTime()}
                        </div>
                        <div dangerouslySetInnerHTML={{__html: this.props.children}}/>
                    </div>
                    <div className="card-action clearfix">
                        {Tags}
                        <div className="right">
                            {this._renderEditIcon()}
                            {this._renderIsLinkIcon()}
                            {this._renderVisibilityIcon()}
                            {this._renderAuthorIcon()}
                            {this._renderBookmarkIcon()}
                            {this._renderGotoArticle()}
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            var Tags = this.props.article.tags.map(function (tag) {
                return (
                    <a key={tag.id}
                       onClick={this._onClickTag.bind(this, tag.id)}
                       className="waves-effect waves-light btn-small grey lighten-5 black-text">
                        {tag.name}
                    </a>
                );
            }.bind(this));

            return (
                <div className="card clearfix blog-article-item article-edition">
                    <div className="card-content">
                        <div className="card-title article-title center clearfix">
                            <h1 className="article-title-card">
                                {this.props.article.title}
                            </h1>
                        </div>

                        <div className="article-editing">
                            <div id={"editor-summernote-" + this.props.article.id}
                                 dangerouslySetInnerHTML={{__html: this.props.children}}/>
                        </div>
                    </div>
                    <div className="card-action clearfix">
                        {Tags}
                        <div className="right">
                            {this._renderEditionIcons()}
                            {this._renderIsLinkIcon()}
                            {this._renderVisibilityIcon()}
                        </div>
                    </div>
                </div>
            );
        } else {
            log.info('Article display mode unknown: ' + this.state.articleDisplayMode);
            return null;
        }
    }
});

module.exports = ArticleItem;
