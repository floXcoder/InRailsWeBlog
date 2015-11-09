var ArticleForm = require('../../components/articles/form');
var ClipboardManager = require('../../modules/clipboard');
var SanitizePaste = require('../../wysiwyg/sanitizePaste');

var ArticleCreation = React.createClass({
    getInitialState: function () {
        return {
            $articleNewForm: null
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
                $('html, body').animate( { scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64 }, 750 );
                $('.blog-form .collapsible').collapsible();

                this.state.$articleNewForm.find('input#title').focus();
            }.bind(this));
    },

    _onPaste: function (content) {
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
            }.bind(this));
        }
    },

    _onSubmit: function () {
        $('html, body').animate( { scrollTop: 0 }, 750 );
        this._toggleNewForm();
    },

    render: function () {
        return (
            <div className="blog-form">
                <div className="margin-bottom-20"/>
                <ul data-collapsible="accordion" className="collapsible article-form-header">
                    <li>
                        <div className="collapsible-header active"><i className="material-icons">mode_edit</i>
                            <h4 className="collection-header">{I18n.t('js.article.new.title')}</h4>
                        </div>
                        <div className="collapsible-body">
                            <ul className="collection">
                                <ArticleForm ref="articleForm" onSubmit={this._onSubmit}/>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

        );
    }
});

module.exports = ArticleCreation;
