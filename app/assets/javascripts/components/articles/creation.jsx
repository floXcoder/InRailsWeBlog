'use strict';

var ArticleForm = require('../../components/articles/form');
var ClipboardManager = require('../../modules/clipboard');
var SanitizePaste = require('../../modules/wysiwyg/sanitizePaste');

var ArticleCreation = React.createClass({
    getInitialState () {
        return {
            isActive: false
        };
    },

    componentDidMount () {
        let $articleNewForm = $('#article-creation-component');
        $articleNewForm.hide();

        $('a#toggle-article-creation').click((event) => {
            event.preventDefault();
            $('#toggle-navbar').sideNav('hide');
            this._toggleNewForm();
        });

        Mousetrap.bind('alt+s', function () {
            this._toggleNewForm();
            return false;
        }.bind(this), 'keydown');

        ClipboardManager.initialize(this._onPaste);

        $(".blog").dblclick(function (event) {
            if ($(event.target).is("input:visible,textarea:visible") || $(event.target).hasClass('note-editable')) {
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

        if ($.getUrlParameter('article_new')) {
            this._toggleNewForm();
        }
    },

    _toggleNewForm () {
        var $articleNewForm = $('#article-creation-component');
        if($articleNewForm.is(":visible")) {
            $articleNewForm.fadeOut(() => {
                //window.history.pushState({articleNew: false}, '', '');
            });
        } else {
            $articleNewForm.fadeIn(() => {
                //window.history.pushState({articleNew: true}, '', '?article_new=true');
                let editorLoader = require('../../loaders/editor');
                editorLoader().then(({}) => {
                    this.setState({isActive: true});

                    $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64}, 750);
                    $('.blog-form .collapsible').collapsible();

                    $articleNewForm.find('input#title').focus();
                });
            });
        }
    },

    _onPaste (content) {
        if (!$('#single-editor').summernote) {
            Materialize.toast(I18n.t('js.article.clipboard.toast.init'), 3000);
        }

        let editorLoader = require('../../loaders/editor');
        editorLoader().then(({}) => {
            var wasActive = this.state.isActive;
            this.setState({isActive: true});

            let $singleEditor = $('#single-editor');
            let singleContent = $singleEditor.summernote('code');
            if (content && $singleEditor && $.isEmpty(singleContent)) {
                let $articleNewForm = $('#article-creation-component');
                $articleNewForm.fadeIn(() => {
                    let pasteContent = SanitizePaste.parse(content);
                    $singleEditor.summernote('code', pasteContent);
                    $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64}, 750);
                    $singleEditor.summernote('focus');
                    this.refs.articleForm.refs.temporary.setState({checked: true});
                    this.refs.articleForm.refs.visibility.setState({value: 'only_me'});
                    this.refs.articleForm.refs.submit.setState({disabled: false});

                    if (!wasActive) {
                        $('.blog-form .collapsible').collapsible();
                    }

                    Materialize.toast(I18n.t('js.article.clipboard.toast.done'), 5000);
                });
            }
        });
    },

    _onCancel () {
        this._toggleNewForm();
        return true;
    },

    _onSubmit () {
        $('html, body').animate({scrollTop: 0}, 750);
        this._toggleNewForm();
        return true;
    },

    render () {
        if (this.state.isActive) {
            return (
                <div className="blog-form">
                    <ul data-collapsible="accordion"
                        className="collapsible article-form-header">
                        <li>
                            <div className="collapsible-header active blue-grey darken-3 white-text">
                                <i className="material-icons">mode_edit</i>
                                <h4 className="collection-header blog-form-title">
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
