'use strict';

var ArticleActions = require('../../../actions/articleActions');
var ArticleEditionIcons = require('../icons/edition');
var ArticleLinkIcon = require('../icons/link');

var ArticleEditionDisplay = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired,
        currentUserId: React.PropTypes.number.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        setDefaultDisplay: React.PropTypes.func.isRequired
    },

    getInitialState () {
        return {
            editor: null,
            isLink: false
        };
    },

    componentDidMount () {
        this._setupEditor();
    },

    componentDidUpdate () {
        this._setupEditor();
    },

    _setupEditor (tagName, event) {
        this.state.editor = $("#editor-summernote-" + this.props.article.id);

        let airToolbar = [
            ['style', ['style', 'bold', 'italic', 'underline']],
            ['undo', ['undo', 'redo']],
            ['view', ['fullscreen', 'codeview']],
            ['para', ['ul', 'ol']],
            ['insert', ['link', 'picture', 'video']]
        ];

        this.state.editor.summernote({
            airMode: true,
            popover: {
                air: airToolbar
            },
            lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
            callbacks: {
                onKeyup: (event) => { this._handleEditorChange(event) }
            }
        });
    },

    _handleEditorChange (event) {
        let text = event.currentTarget.textContent;

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

    _handleTagClick (tagName, event) {
        this.props.onClickTag(tagName, event);
    },

    _handleDeleteClick (event) {
        this.state.editor.summernote('destroy');
        ArticleActions.deleteArticle({id: this.props.article.id});
        this.props.setDefaultDisplay();
    },

    _handleCancelClick (event) {
        this.state.editor.summernote('destroy');
        this.props.setDefaultDisplay();
    },

    _handleSaveClick (event) {
        let content = this.state.editor.summernote('code');
        ArticleActions.updateArticle({id: this.props.article.id, content: content});
        this.state.editor.summernote('destroy');
        this.props.setDefaultDisplay();
    },

    render () {
        let Tags = this.props.article.tags.map(function (tag) {
            return (
                <a key={tag.id}
                   onClick={this._handleTagClick.bind(this, tag.id)}
                   className="waves-effect waves-light btn-small grey lighten-5 black-text">
                    {tag.name}
                </a>
            );
        }.bind(this));

        return (
            <div className="card blog-article-item article-edition clearfix">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            {this.props.article.title}
                        </h1>
                    </div>

                    <div className="article-editing">
                        <div id={"editor-summernote-" + this.props.article.id}
                             className="blog-article-content"
                             dangerouslySetInnerHTML={{__html: this.props.children}}/>
                    </div>
                </div>
                <div className="card-action clearfix">
                    {Tags}
                    <div className="right">
                        <ArticleEditionIcons article={this.props.article}
                                             currentUserId={this.props.currentUserId}
                                             onClickDelete={this._handleDeleteClick}
                                             onClickCancel={this._handleCancelClick}
                                             onClickSave={this._handleSaveClick}/>
                        <ArticleLinkIcon isLink={this.state.isLink}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleEditionDisplay;
