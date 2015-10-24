var ArticleActions = require('../../actions/articleActions');
var TagActions = require('../../actions/tagActions');
var UserStore = require('../../stores/userStore');
var Input = require('../../components/materialize/input');
var Button = require('../../components/materialize/button');
var Textarea = require('../../components/materialize/textarea');
var Select = require('../../components/materialize/select');
var Switch = require('../../components/materialize/switch');
var Checkbox = require('../../components/materialize/checkbox');
var TagsInput = require('../../components/tagsinput/tagsinput');
require('../../wysiwyg/summernote');
require('../../wysiwyg/lang/summernote-fr-FR');

var ArticleForm = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getInitialState: function () {
        return {
            multiLanguage: this.props.multiLanguage || false,
            disabled: true,
            editors: {},
            isLink: false
        };
    },

    componentDidMount: function () {
        if (this.state.multiLanguage) {
            $('.article-form ul.tabs').tabs();

            this._createEditor('#english-editor');
            this._createEditor('#french-editor');
        } else {
            this._createEditor('#single-editor');
        }

        if(this.props.article) {
            this._updateFields();
        }
    },

    componentWillUpdate: function () {
        if (this.state.multiLanguage) {
            this._removeEditor('#english-editor');
            this._removeEditor('#french-editor');
        } else {
            this._removeEditor('#single-editor');
        }
    },

    componentDidUpdate: function () {
        if (this.state.multiLanguage) {
            $('.article-form ul.tabs').tabs();

            this._createEditor("#english-editor");
            this._createEditor('#french-editor');
        } else {
            this._createEditor("#single-editor");
            $('.editor-reset').show();
        }

        if(this.props.article) {
            this._updateFields();
        }
    },

    onPreferenceChange: function (userStore) {
        var newState = {};

        if (!$utils.isEmpty(userStore.preferences) && userStore.preferences.multi_language) {
            var multiLanguage = (userStore.preferences.multi_language !== 'false');
            if(multiLanguage !== this.state.multiLanguage) {
                newState.multiLanguage = multiLanguage;
            }
        }

        if (!$utils.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _createEditor: function (id) {
        if (this.state.editors[id]) {
            return;
        }

        this.state.editors[id] = true;

        var $editor = $(id);

        var toolbar = [
            ['style', ['style', 'bold', 'italic', 'underline']],
            ['specialStyle', ['specialStyle']],
            ['undo', ['undo', 'redo']],
            ['view', ['fullscreen', 'codeview']],
            ['para', ['ul', 'ol']],
            ['insert', ['link', 'picture', 'video']],
            ['help', ['help']]
        ];

        $editor.summernote({
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

    _removeEditor: function (id) {
        this.state.editors[id] = false;

        var $editor = $(id);

        if ($editor.length > 0) {
            $editor.summernote('destroy');
            $editor.empty();
        }
    },

    _updateFields: function() {
        if (this.state.multiLanguage) {
            ReactDOM.findDOMNode(this.refs.englishTitle.refs.englishTitle).value = this.props.article.title_en;
            ReactDOM.findDOMNode(this.refs.englishSummary.refs.englishSummary).value = this.props.article.summary_en;
            ReactDOM.findDOMNode(this.refs.frenchTitle.refs.frenchTitle).value = this.props.article.title_fr;
            ReactDOM.findDOMNode(this.refs.frenchSummary.refs.frenchSummary).value = this.props.article.summary_fr;
            $('#english-editor').summernote('code', this.props.article.content_en);
            $('#french-editor').summernote('code', this.props.article.content_fr);
        } else {
            ReactDOM.findDOMNode(this.refs.title.refs.title).value = this.props.article.title;
            ReactDOM.findDOMNode(this.refs.summary.refs.summary).value = this.props.article.summary;
            $('#single-editor').summernote('code', this.props.article.content);
        }

        if(this.props.article.is_link) {
            this.state.isLink = true;
        }

        this.refs.submit.setState({disabled: false});
    },

    _handleChange: function (event) {
        var text = event.currentTarget.textContent;

        var newState = {};

        if (this.state.multiLanguage) {
            if ($('#english-editor').summernote('code').length === 0 || $('#french-editor').summernote('code').length === 0) {
                this.refs.submit.setState({disabled: true});
            } else {
                if (this.state.disabled) {
                    this.refs.submit.setState({disabled: false});
                }
            }
        } else {
            if (text.length === 0) {
                this.refs.submit.setState({disabled: true});
            } else {
                if (this.state.disabled) {
                    this.refs.submit.setState({disabled: false});
                }
            }
        }

        if ($utils.isURL(text.trim()) && !this.state.isLink) {
            this.state.isLink = true;
            this.refs.isLink.setState({checked: true});
            $('#single-editor').summernote('code', '');
            $('#single-editor').summernote("createLink", {
                text : text.trim(),
                url : text.trim(),
                isNewWindow : true
            });
        } else if(this.state.isLink && !$utils.isURL(text.trim())) {
            this.state.isLink = false;
            this.refs.isLink.setState({checked: false});
        }
    },

    _onBlurSummary: function(event) {
        $('#single-editor').summernote('focus');
        return true;
    },

    _handleSubmit: function (event) {
        event.preventDefault();

        var submitData = {};

        if (this.state.multiLanguage) {
            var englishTitle = ReactDOM.findDOMNode(this.refs.englishTitle.refs.englishTitle).value.trim();
            var englishSummary = ReactDOM.findDOMNode(this.refs.englishSummary.refs.englishSummary).value.trim();
            var englishContent = $('#english-editor').summernote('code');
            var frenchTitle = ReactDOM.findDOMNode(this.refs.frenchTitle.refs.frenchTitle).value.trim();
            var frenchSummary = ReactDOM.findDOMNode(this.refs.frenchSummary.refs.frenchSummary).value.trim();
            var frenchContent = $('#french-editor').summernote('code');

            if ((!englishTitle && !englishContent) && (!frenchTitle && !frenchContent)) {
                return;
            }

            submitData = {
                translations_attributes: [
                    {id: this.props.article.id_en, locale: 'en', title: englishTitle, summary: englishSummary, content: englishContent},
                    {id: this.props.article.id_fr, locale: 'fr', title: frenchTitle, summary: frenchSummary, content: frenchContent}
                ]
            };

            ReactDOM.findDOMNode(this.refs.englishTitle.refs.englishTitle).value = '';
            ReactDOM.findDOMNode(this.refs.englishSummary.refs.englishSummary).value = '';
            ReactDOM.findDOMNode(this.refs.frenchTitle.refs.frenchTitle).value = '';
            ReactDOM.findDOMNode(this.refs.frenchSummary.refs.frenchSummary).value = '';
            $('#english-editor').summernote('code', '');
            $('#french-editor').summernote('code', '');
        } else {
            var title = ReactDOM.findDOMNode(this.refs.title.refs.title).value.trim();
            var summary = ReactDOM.findDOMNode(this.refs.summary.refs.summary).value.trim();
            var content = $('#single-editor').summernote('code');

            if (!content && !title) {
                return;
            }

            submitData = {title: title, summary: summary, content: content};

            ReactDOM.findDOMNode(this.refs.title.refs.title).value = '';
            ReactDOM.findDOMNode(this.refs.summary.refs.summary).value = '';
            $('#single-editor').summernote('code', '');
        }

        var tags = this.refs.tagsinput.state.selectedTags;
        _.merge(submitData, {tags_attributes: tags});

        if(this.state.isLink) {
            _.merge(submitData, {is_link: this.state.isLink});
        }

        if(this.props.article) {
            _.merge(submitData, {id: this.props.article.id});
            _.merge(submitData, {fromEditPage: true});
            ArticleActions.updateArticles(submitData);
            return true;
        } else {
            ArticleActions.pushArticles(submitData);
            this.state.isLink = false;
            this.refs.isLink.setState({checked: false});
            this.refs.submit.setState({disabled: true});
            this.refs.tagsinput.state.selectedTags = [];
            TagActions.fetchTags();
        }

        if(this.props.onSubmit) {
            this.props.onSubmit();
        }
    },

    _createFields: function () {
        if (this.state.multiLanguage) {
            return (
                <div className="row">
                    <div className="col s12 margin-bottom-10">
                        <ul className="tabs">
                            <li className="tab col s6">
                                <a href="#english-form">
                                    {I18n.t('js.language.english')}
                                </a>
                            </li>
                            <li className="tab col s6">
                                <a href="#french-form">
                                    {I18n.t('js.language.french')}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col s12" id="english-form">
                        <Input ref="englishTitle" id="englishTitle" classType="important">
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="englishSummary" id="englishSummary">
                            {I18n.t('js.article.model.summary')}
                        </Input>

                        <div className="editor-reset">
                            <div id="english-editor"/>
                        </div>
                    </div>
                    <div className="col s12" id="french-form">
                        <Input ref="frenchTitle" id="frenchTitle" classType="important">
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="frenchSummary" id="frenchSummary">
                            {I18n.t('js.article.model.summary')}
                        </Input>

                        <div className="editor-reset">
                            <div id="french-editor"/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Input ref="title" id="title" classType="important">
                        {I18n.t('js.article.model.title')}
                    </Input>
                    <Input ref="summary" id="summary" onBlur={this._onBlurSummary}>
                        {I18n.t('js.article.model.summary')}
                    </Input>

                    <div className="editor-reset">
                        <div id="single-editor"/>
                    </div>
                </div>
            )
        }
    },

    render: function () {
        var article = this.props.article || {};

        return (
            <form className="article-form" onSubmit={this._handleSubmit}>

                { this._createFields() }

                <div className="row margin-top-10">
                    <div className="col s6">
                        {I18n.t('js.article.new.tags.title')}
                        <TagsInput ref="tagsinput" selectedTags={this.props.tags || []}/>
                    </div>

                    <div className="col s3 center">
                        <Checkbox ref="isLink"
                                  id="isLink"
                                  checked={article.is_link || this.state.isLink}>
                            {I18n.t('js.article.model.is_link')}
                        </Checkbox>
                    </div>
                    <div ref="visibility" className="col s3">
                        <Select title={I18n.t('js.article.visibility.title')}
                                defaultOption={article.visibility || "default"}
                                options={I18n.t('js.article.visibility.enum')}>
                            {I18n.t('js.article.model.visibility')}
                        </Select>
                    </div>
                </div>
                <Button ref="submit" icon="send">
                    {this.props.article ? I18n.t('js.article.edit.submit') : I18n.t('js.article.new.submit')}
                </Button>
            </form>
        );
    }
});

module.exports = ArticleForm;
