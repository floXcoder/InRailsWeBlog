"use strict";

var Input = require('../../components/materialize/input');
var Button = require('../../components/materialize/button');
var Select = require('../../components/materialize/select');
var Checkbox = require('../../components/materialize/checkbox');
var TagsInput = require('../../components/tagsinput/tagsinput');

var TagActions = require('../../actions/tagActions');

var UserStore = require('../../stores/userStore');

var ArticleActions = require('../../actions/articleActions');

var ArticleForm = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    propTypes: {
        article: React.PropTypes.object,
        multiLanguage: React.PropTypes.bool,
        temporary: React.PropTypes.bool,
        onSubmit: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            article: null,
            tags: null,
            multiLanguage: false,
            temporary: false,
            onSubmit: null
        };
    },

    getInitialState: function () {
        return {
            multiLanguage: this.props.multiLanguage || false,
            editors: {},
            isLink: false,
            isSubmitted: false
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

        if (this.props.article) {
            this._updateFields();
        }

        if (this.props.article) {
            window.onbeforeunload = function (event) {
                if (!this.state.isSubmitted) {
                    var message;
                    event = event || window.event;
                    message = I18n.t('js.article.edit.exit');
                    if (event) {
                        event.returnValue = message;
                    }
                    return message;
                }
            }.bind(this);
        } else {
            window.onunload = function (event) {
                if (!this.state.isSubmitted && !this.refs.submit.disabled) {
                    this.refs.temporary.state.checked = true;
                    this._submitNow(event);
                    return true;
                }
            }.bind(this);
        }

        // Fetch tags to populate TagsInput
        TagActions.fetchTags();
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

        if (this.props.article) {
            this._updateFields();
        }
    },

    onPreferenceChange: function (userStore) {
        var newState = {};

        if (!$.isEmpty(userStore.preferences)) {
            if (userStore.preferences.multi_language !== this.state.multiLanguage) {
                newState.multiLanguage = userStore.preferences.multi_language;
            }
        }

        if (!$.isEmpty(newState)) {
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
                    this._handleEditorChange(event);
                    return true;
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

    _updateFields: function () {
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
            $('#single-editor').summernote('focus');
        }

        if (this.props.article.is_link) {
            this.state.isLink = true;
        }

        this.refs.submit.setState({disabled: false});
    },

    _handleEditorChange: function (event) {
        var text = event.currentTarget.textContent;

        if (text.length < window.parameters.content_min_length) {
            this.refs.submit.setState({disabled: true});
        } else if (text.length > window.parameters.content_max_length) {
            this.refs.submit.setState({disabled: true});
        } else {
            this.refs.submit.setState({disabled: false});
        }

        if (!this.state.isLink && $.isURL(text.trim())) {
            this.state.isLink = true;
            this.refs.isLink.setState({checked: true});
            var $singleEditor = $('#single-editor');
            $singleEditor.summernote('code', '');
            $singleEditor.summernote('createLink', {
                text: text.trim(),
                url: text.trim(),
                isNewWindow: true
            });
        } else if (this.state.isLink && !$.isURL(text.trim())) {
            this.state.isLink = false;
            this.refs.isLink.setState({checked: false});
        }
    },

    _onBlurSummary: function (event) {
        $('#single-editor').summernote('focus');
        return true;
    },

    _serializeEditor: function () {
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
                    {
                        id: this.props.article.id_en,
                        locale: 'en',
                        title: englishTitle,
                        summary: englishSummary,
                        content: englishContent
                    },
                    {
                        id: this.props.article.id_fr,
                        locale: 'fr',
                        title: frenchTitle,
                        summary: frenchSummary,
                        content: frenchContent
                    }
                ]
            };
        } else {
            var $singleEditor = $('#single-editor');
            var title = ReactDOM.findDOMNode(this.refs.title.refs.title).value.trim();
            var summary = ReactDOM.findDOMNode(this.refs.summary.refs.summary).value.trim();
            var content = $singleEditor.summernote('code');

            if (!content && !title) {
                return;
            }
            submitData = {title: title, summary: summary, content: content};
        }

        return submitData;
    },

    _serializeTag: function () {
        var submitData = {};

        var tags = this.refs.tagsinput.state.selectedTags;
        _.merge(submitData, {tags_attributes: tags});

        return submitData;
    },

    _resetForm: function () {
        if (this.state.multiLanguage) {
            ReactDOM.findDOMNode(this.refs.englishTitle.refs.englishTitle).value = '';
            ReactDOM.findDOMNode(this.refs.englishSummary.refs.englishSummary).value = '';
            ReactDOM.findDOMNode(this.refs.frenchTitle.refs.frenchTitle).value = '';
            ReactDOM.findDOMNode(this.refs.frenchSummary.refs.frenchSummary).value = '';
            $('#english-editor').summernote('code', '');
            $('#french-editor').summernote('code', '');
        } else {
            ReactDOM.findDOMNode(this.refs.title.refs.title).value = '';
            ReactDOM.findDOMNode(this.refs.summary.refs.summary).value = '';
            $('#single-editor').summernote('code', '');
        }
        this.state.isLink = false;
        this.refs.isLink.setState({checked: false});
        this.refs.temporary.setState({checked: false});
        this.refs.submit.setState({disabled: true});
        this.refs.tagsinput.state.selectedTags = [];
    },

    _cancelForm: function (event) {
        event.preventDefault();

        this.props.onCancel();
        this._resetForm();
        this.setState({isSubmitted: false});
    },

    _handleSubmit: function (event) {
        event.preventDefault();
        this.state.isSubmitted = true;

        var submitData = {};

        // Editor content
        _.merge(submitData, this._serializeEditor());
        // Tags
        _.merge(submitData, this._serializeTag());
        // Temporary checkbox
        _.merge(submitData, {temporary: this.refs.temporary.state.checked});
        // isLink checkbox
        _.merge(submitData, {is_link: this.state.isLink});
        // Visibility
        if (this.refs.visibility.state.value !== 'default') {
            _.merge(submitData, {visibility: this.refs.visibility.state.value});
        }

        // Article id and fromEditPage if article exist
        if (this.props.article) {
            _.merge(submitData, {id: this.props.article.id});
            _.merge(submitData, {fromEditPage: true});
            ArticleActions.updateArticles(submitData);
        } else {
            ArticleActions.pushArticles(submitData);
            TagActions.fetchTags();
            this._resetForm();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    },

    _submitNow: function (event) {
        event.preventDefault();

        var submitData = {};

        _.merge(submitData, this._serializeEditor());
        _.merge(submitData, this._serializeTag());

        _.merge(submitData, {temporary: this.refs.temporary.state.checked});
        if (this.state.isLink) {
            _.merge(submitData, {is_link: this.state.isLink});
        }

        var requestParam = {};
        requestParam.articles = submitData;

        $.ajax({
            url: '/articles',
            async: false,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
                return true;
            },
            error: function (xhr, status, error) {
                return false;
            }
        });
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
                        <Input ref="englishTitle" id="englishTitle" classType="important"
                               minLength={window.parameters.title_min_length}
                               maxLength={window.parameters.title_max_length}>
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="englishSummary" id="englishSummary"
                               minLength={window.parameters.summary_min_length}
                               maxLength={window.parameters.summary_max_length}>
                            {I18n.t('js.article.model.summary')}
                        </Input>

                        <div className="editor-reset">
                            <div id="english-editor"/>
                        </div>
                    </div>
                    <div className="col s12" id="french-form">
                        <Input ref="frenchTitle" id="frenchTitle" classType="important"
                               minLength={window.parameters.title_min_length}
                               maxLength={window.parameters.title_max_length}>
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="frenchSummary" id="frenchSummary"
                               minLength={window.parameters.summary_min_length}
                               maxLength={window.parameters.summary_max_length}>
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
                    <Input ref="title" id="title" classType="important"
                           minLength={window.parameters.title_min_length}
                           maxLength={window.parameters.title_max_length}>
                        {I18n.t('js.article.model.title')}
                    </Input>
                    <Input ref="summary" id="summary" onBlur={this._onBlurSummary}
                           minLength={window.parameters.summary_min_length}
                           maxLength={window.parameters.summary_max_length}>
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
        if (this.props.article) {
            var childTags = _.indexBy(this.props.article.child_tags, 'id');
            var parentTags = _.indexBy(this.props.article.parent_tags, 'id');
            var tags = this.props.article.tags.map(function (tag) {
                var tagWithRelation = tag;
                if (parentTags[tag.id]) {
                    tagWithRelation.parent = true;
                } else if (childTags[tag.id]) {
                    tagWithRelation.child = true;
                }
                return tagWithRelation;
            }.bind(this));
        }

        var article = this.props.article || {};

        return (
            <form className="article-form" onSubmit={this._handleSubmit}>

                { this._createFields() }

                <div className="row margin-top-10">
                    <div className="col l6 m6 s12">
                        {I18n.t('js.article.new.tags.title')}
                        <TagsInput ref="tagsinput"
                                   selectedTags={tags || []}/>
                    </div>

                    <div className="col s6 m6 l3">
                        <Checkbox ref="temporary"
                                  id="temporary"
                                  checked={article.temporary || this.props.temporary}>
                            {I18n.t('js.article.model.temporary')}
                        </Checkbox>
                        <div className="margin-bottom-20"/>
                        <Checkbox ref="isLink"
                                  id="isLink"
                                  checked={article.is_link || this.state.isLink}>
                            {I18n.t('js.article.model.is_link')}
                        </Checkbox>
                    </div>
                    <div className="col s6 m6 l3">
                        <Select ref="visibility"
                                id="visibility"
                                title={I18n.t('js.article.visibility.title')}
                                value={article.visibility || "default"}
                                options={I18n.t('js.article.visibility.enum')}>
                            {I18n.t('js.article.model.visibility')}
                        </Select>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <Button ref="submit" icon="send">
                            {this.props.article ? I18n.t('js.article.edit.submit') : I18n.t('js.article.new.submit')}
                        </Button>
                    </div>
                    <div className="col s6 right-align">
                        <a className="waves-effect waves-teal btn-flat"
                           onClick={this._cancelForm}>
                            {I18n.t('js.buttons.cancel')}
                        </a>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = ArticleForm;
