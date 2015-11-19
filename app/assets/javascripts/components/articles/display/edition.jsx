var ArticleActions = require('../../../actions/articleActions');
var ArticleEditionIcons = require('../icons/edition');
var ArticleLinkIcon = require('../icons/link');
var ArticleVisibilityIcon = require('../icons/visibility');

var ArticleEditionDisplay = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        setDefaultDisplay: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            editor: null,
            isLink: false
        };
    },

    componentDidMount: function () {
        this._setupEditor();
    },

    componentDidUpdate: function () {
        this._setupEditor();
    },

    _setupEditor: function (tagName, event) {
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
            popover: {
                air: airToolbar
            },
            lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
            callbacks: {
                onKeyup: function (event) {
                    this._handleEditorChange(event);
                }.bind(this)
            }
        });
    },

    _handleEditorChange: function (event) {
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
        this.props.onClickTag(tagName, event);
    },

    _onClickDelete: function (event) {
        this.state.editor.summernote('destroy');
        ArticleActions.deleteArticles({id: this.props.article.id});
        this.props.setDefaultDisplay();
    },

    _onClickCancel: function (event) {
        this.state.editor.summernote('destroy');
        this.props.setDefaultDisplay();
    },

    _onClickSave: function (event) {
        var content = this.state.editor.summernote('code');
        ArticleActions.updateArticles({id: this.props.article.id, content: content});
        this.state.editor.summernote('destroy');
        this.props.setDefaultDisplay();
    },

    render: function () {
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
                        <ArticleEditionIcons article={this.props.article}
                                             userId={this.props.userId}
                                             onClickDelete={this._onClickDelete}
                                             onClickCancel={this._onClickCancel}
                                             onClickSave={this._onClickSave}/>
                        <ArticleLinkIcon isLink={this.state.isLink}/>
                        <ArticleVisibilityIcon article={this.props.article} userId={this.props.userId}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleEditionDisplay;
