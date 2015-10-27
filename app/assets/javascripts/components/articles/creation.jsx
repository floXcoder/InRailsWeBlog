var ArticleActions = require('../../actions/articleActions');
var ArticleForm = require('../../components/articles/form');

var ArticleCreation = React.createClass({
    getInitialState: function () {
        return {
            $articleNewForm: null
        };
    },

    componentDidMount: function () {
        this.state.$articleNewForm = $('#article-creation-component');
        this.state.$articleNewForm.hide();

        $('a#toggle-article-creation').click(function () {
            this._toggleNewForm();

            return false;
        }.bind(this));
    },

    _toggleNewForm: function () {
        this.state.$articleNewForm.is(":visible") ?
            this.state.$articleNewForm.fadeOut() :
            this.state.$articleNewForm.fadeIn(function () {
                $('html, body').animate( { scrollTop: $(ReactDOM.findDOMNode(this)).offset().top - 64 }, 750 );

                this.state.$articleNewForm.find('input#title').focus();

                $('.blog-form .collapsible').collapsible();
            }.bind(this));
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
                                <ArticleForm onSubmit={this._onSubmit}/>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

        );
    }
});

module.exports = ArticleCreation;
