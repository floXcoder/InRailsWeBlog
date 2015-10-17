var ArticleActions = require('../../actions/articleActions');
var TagActions = require('../../actions/tagActions');
var Input = require('../../components/materialize/input');
var Button = require('../../components/materialize/button');
var Textarea = require('../../components/materialize/textarea');
var Select = require('../../components/materialize/select');
var Checkbox = require('../../components/materialize/checkbox');
var TagsInput = require('../../components/tagsinput/tagsinput');

require('../../wysiwyg/summernote');
require('../../wysiwyg/lang/summernote-fr-FR');

var ArticleForm = React.createClass({
    getInitialState: function () {
        return {
            text: '',
            editor: null
        };
    },

    componentDidMount: function () {
        this.state.editor = $('#editor-summernote');

        //var toolbar = [
        //    ['style', ['style', 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        //    ['fonts', ['fontname', 'fontsize']],
        //    ['color', ['color']],
        //    ['undo', ['undo', 'redo']],
        //    //['table', ['table']],
        //    ['view', ['fullscreen', 'codeview']],
        //    ['help', ['help']],
        //    ['para', ['ul', 'ol', 'paragraph']],
        //    ['height', ['hr', 'height', 'specialchar']],
        //    ['insert', ['link', 'picture', 'video']]
        //];
        var toolbar = [
            ['style', ['style', 'bold', 'italic', 'underline']],
            ['undo', ['undo', 'redo']],
            ['view', ['fullscreen', 'codeview']],
            ['para', ['ul', 'ol']],
            ['insert', ['link', 'picture', 'video']],
            ['help', ['help']]
        ];

        this.state.editor.summernote({
            lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
            toolbar: toolbar,
            otherStaticBarClass: 'nav-wrapper',
            followingToolbar: true,
            height: 300,
            callbacks: {
                onKeyup: function (event) {
                    this._handleChange(event);
                }.bind(this)
            }
        });
    },

    _handleSubmit: function (event) {
        event.preventDefault();
        var title = ReactDOM.findDOMNode(this.refs.title.refs.title).value.trim();
        var content = this.state.editor.summernote('code');
        var tags = this.refs.tagsinput.state.selectedTags;

        if (!content && !title) {
            return;
        }

        ArticleActions.pushArticles({title: title, content: content, tags_attributes: tags});

        ReactDOM.findDOMNode(this.refs.title.refs.title).value = '';
        this.state.editor.summernote('code', '');
        this.refs.submit.setState({disabled: true});
        this.refs.tagsinput.state.selectedTags = [];
        TagActions.fetchTags();
    },

    _handleChange: function (event) {
        var text = event.currentTarget.textContent;
        if (text.length === 0) {
            this.refs.submit.setState({disabled: true});
        } else {
            this.refs.submit.setState({disabled: false});
        }
    },

    _createArticleForm: function () {
        return (
            <form className="blog-form article-form" onSubmit={this._handleSubmit}>
                <Input ref="title" id="title" classType="important">
                    {I18n.t('js.article.model.title')}
                </Input>
                <Input ref="summary" id="summary">
                    {I18n.t('js.article.model.summary')}
                </Input>

                <div className="editor-reset">
                    <div id="editor-summernote"/>
                </div>

                <div className="row margin-top-10">
                    <div className="col s6">
                        {I18n.t('js.article.new.tags.title')}
                        <TagsInput ref="tagsinput"/>
                    </div>

                    <div className="col s3 center">
                        {I18n.t('js.article.model.allow_comment')}
                        <Checkbox values={I18n.t('js.checkbox')}/>
                    </div>
                    <div className="col s3">
                        <Select title={I18n.t('js.article.visibility.title')}
                                options={I18n.t('js.article.visibility.enum')}>
                            {I18n.t('js.article.model.visibility')}
                        </Select>
                    </div>
                </div>
                <Button ref="submit" icon="send">
                    {I18n.t('js.article.new.submit')}
                </Button>
            </form>
        );
    },

    render: function () {
        return (
            <ul data-collapsible="accordion" className="collapsible article-form-header">
                <li>
                    <div className="collapsible-header"><i className="material-icons">mode_edit</i>
                        <h4 className="collection-header">{I18n.t('js.article.new.title')}</h4>
                    </div>
                    <div className="collapsible-body">
                        <ul className="collection">
                            { this._createArticleForm() }
                        </ul>
                    </div>
                </li>
            </ul>

        );
    }
});

module.exports = ArticleForm;
