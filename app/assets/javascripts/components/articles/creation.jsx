"use strict";

var ArticleForm = require('../../components/articles/form');
var ClipboardManager = require('../../modules/clipboard');
var SanitizePaste = require('../../wysiwyg/sanitizePaste');

var ArticleCreation = React.createClass({
    getInitialState: function () {
        return {
            $articleNewForm: null,
            isActive: false
        };
    },

    componentDidMount: function () {
        this.state.$articleNewForm = $('#article-creation-component');
        this.state.$articleNewForm.hide();

        $('a#toggle-article-creation').click(function (event) {
            event.preventDefault();
            this._toggleNewForm();
            return false;
        }.bind(this));

        ClipboardManager.initialize(this._onPaste);

        $(".blog").dblclick(function(event) {
            if ($(event.target).is("input:visible,textarea:visible") || $(event.target).hasClass('note-editable')) {
                return;
            }

            // Abort if it looks like they've selected some text
            if (window.getSelection && !$.isEmpty(window.getSelection().toString())) {
                return;
            }
            if (document.selection && !$.isEmpty(document.selection.createRange().text)) {
                return;
            }

            event.preventDefault();
            this._toggleNewForm();
        }.bind(this));
    },

    _toggleNewForm: function () {
        this.state.$articleNewForm.is(":visible") ?
            this.state.$articleNewForm.fadeOut() :
            this.state.$articleNewForm.fadeIn(function () {
                require.ensure([], () => {
                    require('../../wysiwyg/summernote');
                    require('../../wysiwyg/lang/summernote-en-US');
                    require('../../wysiwyg/lang/summernote-fr-FR');
                    this.setState({isActive: true});

                    $('html, body').animate( { scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64 }, 750 );
                    $('.blog-form .collapsible').collapsible();

                    this.state.$articleNewForm.find('input#title').focus();
                });
            }.bind(this));
    },

    _onPaste: function (content) {
        require.ensure([], () => {
            require('../../wysiwyg/summernote');
            require('../../wysiwyg/lang/summernote-en-US');
            require('../../wysiwyg/lang/summernote-fr-FR');
            this.setState({isActive: true});

            var $singleEditor = $('#single-editor');
            var singleContent = $singleEditor.summernote('code');
            if(content && $singleEditor && $.isEmpty(singleContent)) {
                this.state.$articleNewForm.fadeIn(function () {
                    var pasteContent = SanitizePaste.parse(content);
                    $singleEditor.summernote('code', pasteContent);
                    $('html, body').animate( { scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64 }, 750 );
                    $('.blog-form .collapsible').collapsible();
                    $singleEditor.summernote('focus');
                    this.refs.articleForm.refs.temporary.setState({checked: true});
                    this.refs.articleForm.refs.visibility.setState({value: 'only_me'});
                    this.refs.articleForm.refs.submit.setState({disabled: false});
                }.bind(this));
            }
        });
    },

    _onCancel: function () {
        this._toggleNewForm();
        return true;
    },

    _onSubmit: function () {
        $('html, body').animate( { scrollTop: 0 }, 750 );
        this._toggleNewForm();
        return true;
    },

    render: function () {
        if(this.state.isActive) {
            return (
                <div className="blog-form">
                    <div className="margin-bottom-20"/>
                    <ul data-collapsible="accordion"
                        className="collapsible article-form-header">
                        <li>
                            <div className="collapsible-header active">
                                <i className="material-icons">mode_edit</i>
                                <h4 className="collection-header">
                                    {I18n.t('js.article.new.title')}
                                </h4>
                            </div>
                            <div className="collapsible-body">
                                <ul className="collection">
                                    <ArticleForm ref="articleForm"
                                                 onCancel={this._onCancel}
                                                 onSubmit={this._onSubmit}/>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

            );
        } else {
            return null;
        }


    }
});

module.exports = ArticleCreation;
