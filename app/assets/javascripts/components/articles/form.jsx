'use strict';

var Input = require('../../components/materialize/input');
var Button = require('../../components/materialize/button');
var Select = require('../../components/materialize/select');
var Switch = require('../../components/materialize/switch');
var Checkbox = require('../../components/materialize/checkbox');
var TagsInput = require('../../components/tagsinput/tagsinput');

var TagActions = require('../../actions/tagActions');

var UserStore = require('../../stores/userStore');

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');

var ArticleForm = React.createClass({
    propTypes: {
        article: React.PropTypes.object,
        multiLanguage: React.PropTypes.bool,
        temporary: React.PropTypes.bool,
        onCancel: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getDefaultProps () {
        return {
            article: null,
            tags: null,
            multiLanguage: false,
            temporary: false,
            onSubmit: null
        };
    },

    getInitialState () {
        return {
            multiLanguage: this.props.multiLanguage || false,
            editors: {},
            isLink: false,
            isSubmitted: false
        };
    },

    componentDidMount () {
        if (this.state.multiLanguage) {
            $('.article-form ul.tabs').tabs();

            this._createEditor('#english-editor');
            this._createEditor('#french-editor');
        } else {
            this._createEditor('#single-editor');
        }

        if (this.props.article) {
            this._updateFields();

            window.onbeforeunload = function (event) {
                if (!this.state.isSubmitted) {
                    event = event || window.event;
                    let message = I18n.t('js.article.edit.exit');
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

    componentWillUpdate () {
        if (this.state.multiLanguage) {
            this._removeEditor('#english-editor');
            this._removeEditor('#french-editor');
        } else {
            this._removeEditor('#single-editor');
        }
    },

    componentDidUpdate () {
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

    onPreferenceChange (userData) {
        var newState = {};

        if (!$.isEmpty(userData.preferences)) {
            if (userData.preferences.multi_language !== this.state.multiLanguage) {
                newState.multiLanguage = userData.preferences.multi_language;
            }
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _createEditor (id) {
        if (this.state.editors[id]) {
            return;
        }

        this.state.editors[id] = true;

        let $editor = $(id);

        let toolbar = [];
        if(window.innerWidth > window.parameters.medium_screen_up) {
            toolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['specialStyle', ['specialStyle']],
                ['undo', ['undo', 'redo']],
                ['view', ['fullscreen', 'codeview']],
                ['para', ['ul', 'ol']],
                ['insert', ['link', 'picture', 'video']],
                ['help', ['help']]
            ];
        } else {
            toolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['specialStyle', ['specialStyle']],
                ['view', ['fullscreen']],
                ['para', ['ul', 'ol']],
                ['insert', ['link', 'picture', 'video']]
            ];
        }

        $editor.summernote({
            lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
            toolbar: toolbar,
            otherStaticBarClass: 'nav-wrapper',
            followingToolbar: true,
            height: 300,
            callbacks: {
                onKeyup: (event) => {
                    this._handleEditorChange(event);
                    return true;
                }
            }
        });
    },

    _removeEditor (id) {
        this.state.editors[id] = false;

        var $editor = $(id);

        if ($editor.length > 0) {
            $editor.summernote('destroy');
            $editor.empty();
        }
    },

    _updateFields () {
        if (this.state.multiLanguage) {
            this.refs.englishTitle.setValue(this.props.article.title_en);
            this.refs.englishSummary.setValue(this.props.article.summary_en);
            this.refs.frenchTitle.setValue(this.props.article.title_fr);
            this.refs.frenchSummary.setValue(this.props.article.summary_fr);
            $('#english-editor').summernote('code', this.props.article.content_en);
            $('#french-editor').summernote('code', this.props.article.content_fr);
        } else {
            this.refs.title.setValue(this.props.article.title);
            this.refs.summary.setValue(this.props.article.summary);
            $('#single-editor').summernote('code', this.props.article.content);
            $('#single-editor').summernote('focus');
        }

        if (this.props.article.is_link) {
            this.state.isLink = true;
        }

        this.refs.submit.setState({disabled: false});
    },

    _handleInputChange (event) {
        if (this.state.multiLanguage) {
            if ((this.refs.englishTitle.value().length < window.parameters.title_min_length ||
                this.refs.frenchTitle.value().length < window.parameters.title_min_length) &&
                (this.refs.englishSummary.value().length < window.parameters.summary_min_length ||
                this.refs.frenchSummary.value().length < window.parameters.summary_min_length)) {
                this.refs.submit.setState({disabled: true});
            } else {
                this.refs.submit.setState({disabled: false});
            }
        } else {
            if (this.refs.title.value().length < window.parameters.title_min_length &&
                this.refs.summary.value().length < window.parameters.summary_min_length) {
                this.refs.submit.setState({disabled: true});
            } else {
                this.refs.submit.setState({disabled: false});
            }
        }

        return event;
    },

    _handleEditorChange (event) {
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
            let $singleEditor = $('#single-editor');
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

        return event;
    },

    _onBlurSummary (event) {
        $('#single-editor').summernote('focus');
        return event;
    },

    _serializeEditor () {
        var submitData = {};

        if (this.state.multiLanguage) {
            var englishTitle = this.refs.englishTitle.value().trim();
            var englishSummary = this.refs.englishSummary.value().trim();
            var englishContent = $('#english-editor').summernote('code');

            var frenchTitle = this.refs.frenchTitle.value().trim();
            var frenchSummary = this.refs.frenchSummary.value().trim();
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
            let title = this.refs.title.value().trim();
            let summary = this.refs.summary.value().trim();
            let content = $singleEditor.summernote('code');

            if (!content && !title) {
                return;
            }
            submitData = {title: title, summary: summary, content: content};
        }

        return submitData;
    },

    _serializeTag () {
        let submitData = {};

        let tags = this.refs.tagsinput.selectedTags();
        _.merge(submitData, {tags_attributes: tags});

        return submitData;
    },

    _resetForm () {
        if (this.state.multiLanguage) {
            this.refs.englishTitle.setValue('');
            this.refs.englishSummary.setValue('');
            this.refs.frenchTitle.setValue('');
            $('#english-editor').summernote('code', '');
            this.refs.frenchSummary.setValue('');
            $('#french-editor').summernote('code', '');
        } else {
            this.refs.title.setValue('');
            this.refs.summary.setValue('');
            $('#single-editor').summernote('code', '');
        }
        this.state.isLink = false;
        this.refs.isLink.setState({checked: false});
        this.refs.temporary.setState({checked: false});
        this.refs.submit.setState({disabled: true});
        this.refs.tagsinput.resetSelectedTags();
    },

    _handleCancelClick (event) {
        event.preventDefault();

        this.props.onCancel();
        this._resetForm();
        this.setState({isSubmitted: false});
    },

    _handleSubmit (event) {
        event.preventDefault();
        this.state.isSubmitted = true;

        let submitData = {};

        // Editor content
        _.merge(submitData, this._serializeEditor());
        // Tags
        _.merge(submitData, this._serializeTag());
        // Comment switch
        _.merge(submitData, {allow_comment: this.refs.comment.value()});
        // Temporary checkbox
        _.merge(submitData, {temporary: this.refs.temporary.isChecked()});
        // isLink checkbox
        _.merge(submitData, {is_link: this.state.isLink});
        // Visibility
        if (this.refs.visibility.value() !== 'default') {
            _.merge(submitData, {visibility: this.refs.visibility.value()});
        }

        // Article id and fromEditPage if article exist
        if (this.props.article) {
            _.merge(submitData, {id: this.props.article.id});
            _.merge(submitData, {fromEditPage: true});
            ArticleActions.updateArticle(submitData);
        } else {
            ArticleActions.addArticle(submitData);
            TagActions.fetchTags();
            this._resetForm();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    },

    _submitNow (event) {
        event.preventDefault();

        var submitData = {};

        _.merge(submitData, this._serializeEditor());
        _.merge(submitData, this._serializeTag());

        _.merge(submitData, {temporary: this.refs.temporary.state.checked});
        if (this.state.isLink) {
            _.merge(submitData, {is_link: this.state.isLink});
        }

        if(submitData.content &&
            submitData.title.length > window.parameters.title_min_length &&
            submitData.summary.length > window.parameters.summary_min_length &&
            submitData.content.length > window.parameters.content_min_length) {
            ArticleStore.onAutosaveArticle(submitData);
        }
    },

    _createFields () {
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
                    <div id="english-form"
                         className="col s12">
                        <Input ref="englishTitle"
                               id="english-title"
                               classType="important"
                               characterCount={window.parameters.title_max_length}
                               onInput={this._handleInputChange}>
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="englishSummary"
                               id="english-summary"
                               characterCount={window.parameters.summary_max_length}
                               onInput={this._handleInputChange}>
                            {I18n.t('js.article.model.summary')}
                        </Input>

                        <div className="editor-reset">
                            <div id="english-editor"/>
                        </div>
                    </div>
                    <div id="french-form"
                         className="col s12">
                        <Input ref="frenchTitle"
                               id="french-title"
                               classType="important"
                               characterCount={window.parameters.title_max_length}
                               onInput={this._handleInputChange}>
                            {I18n.t('js.article.model.title')}
                        </Input>
                        <Input ref="frenchSummary"
                               id="french-summary"
                               characterCount={window.parameters.summary_max_length}
                               onInput={this._handleInputChange}>
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
                    <Input ref="title"
                           id="title"
                           classType="important"
                           characterCount={window.parameters.title_max_length}
                           onInput={this._handleInputChange}>
                        {I18n.t('js.article.model.title')}
                    </Input>
                    <Input ref="summary"
                           id="summary"
                           onBlur={this._onBlurSummary}
                           characterCount={window.parameters.summary_max_length}
                           onInput={this._handleInputChange}>
                        {I18n.t('js.article.model.summary')}
                    </Input>

                    <div className="form-editor-title">
                        {I18n.t('js.article.model.content')}
                    </div>
                    <div className="editor-reset">
                        <div id="single-editor"/>
                    </div>
                </div>
            )
        }
    },

    render () {
        if (this.props.article) {
            let childTags = _.indexBy(this.props.article.child_tags, 'id');
            let parentTags = _.indexBy(this.props.article.parent_tags, 'id');
            var tags = this.props.article.tags.map(function (tag) {
                let tagWithRelation = tag;
                if (parentTags[tag.id]) {
                    tagWithRelation.parent = true;
                } else if (childTags[tag.id]) {
                    tagWithRelation.child = true;
                }
                return tagWithRelation;
            }.bind(this));
        }

        let article = this.props.article || {};

        return (
            <form className="article-form"
                  onSubmit={this._handleSubmit}>
                {this._createFields()}

                <div className="row margin-top-10">
                    <div className="col s12 m6 l6">
                        {I18n.t('js.article.new.tags.title')}
                        <TagsInput ref="tagsinput"
                                   initialSelectedTags={tags}/>
                    </div>

                    <div className="col s12 m6 l3">
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
                    <div className="col s12 m6 l3">
                        <Switch ref="comment"
                                id="comment"
                                values={I18n.t('js.article.model.comment')}
                                checked={true}>
                            {I18n.t('js.article.model.allow_comment')}
                        </Switch>

                        <div className="margin-bottom-40"/>

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
                    <div className="col s6 left-align">
                        <a className="waves-effect waves-teal btn-flat"
                           onClick={this._handleCancelClick}>
                            {I18n.t('js.buttons.cancel')}
                        </a>
                    </div>
                    <div className="col s6 right-align">
                        <Button ref="submit"
                                icon="send">
                            {this.props.article ? I18n.t('js.article.edit.submit') : I18n.t('js.article.new.submit')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = ArticleForm;
