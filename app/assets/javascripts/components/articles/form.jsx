var ArticleActions = require('../../actions/articleActions');
var Input = require('../../components/materialize/input');
var Button = require('../../components/materialize/button');
var Textarea = require('../../components/materialize/textarea');
var Select = require('../../components/materialize/select');
var Checkbox = require('../../components/materialize/checkbox');

var ArticleForm = React.createClass({
    getInitialState: function () {
        return {
            text: ''
        };
    },

    _handleSubmit: function (event) {
        event.preventDefault();
        var title = React.findDOMNode(this.refs.title.refs.title).value.trim();
        var content = React.findDOMNode(this.refs.content.refs.content).value.trim();
        if (!content || !title) {
            return;
        }
        ArticleActions.pushArticles({title: title, content: content});

        React.findDOMNode(this.refs.title.refs.title).value = '';
        React.findDOMNode(this.refs.content.refs.content).value = '';
        return;
    },

    _handleChange: function (event) {
        var text = event.target.value;
        if (text.length === 0) {
            this.refs.submit.setState({disabled: true});
        } else {
            this.refs.submit.setState({disabled: false});
        }
    },

    _createArticleForm: function () {
        return (
            <form className="blog-form form-article" onSubmit={this._handleSubmit}>
                <Input ref="title" id="title" classType="important">
                    {I18n.t('js.article.model.title')}
                </Input>
                <Input ref="summary" id="summary">
                    {I18n.t('js.article.model.summary')}
                </Input>
                <Textarea ref="content" id="content" onChange={this._handleChange}>
                    {I18n.t('js.article.model.content')}
                </Textarea>

                <div className="row">
                    <div className="col s6">
                        <Select title={I18n.t('js.article.visibility.title')}
                                options={I18n.t('js.article.visibility.enum')}>
                            {I18n.t('js.article.model.visibility')}
                        </Select>
                    </div>
                    <div className="col s6 center">
                        <Checkbox values={I18n.t('js.checkbox')}>
                            {I18n.t('js.article.model.allow_comment')}
                        </Checkbox>
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
            <ul data-collapsible="accordion" className="collapsible">
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
//<div className="row">
//    <div className="col s12">
//        <div className="card-panel">
//            <h3>Add a new article</h3>
//
//            <form className="articleForm" onSubmit={this._handleSubmit}>
//                <Input ref="title" id="title" classType="important" icon="mode_edit">Title</Input>
//                <Input ref="summary" id="summary">Summary</Input>
//                <Textarea ref="content" id="content" text="Content" onChange={this._handleChange}/>
//                <div className="row">
//                    <div className="col s6">
//                        <Select />
//                    </div>
//                    <div className="col s6 center">
//                        <Checkbox />
//                    </div>
//                </div>
//                <Button ref="submit" icon="send">New post</Button>
//            </form>
//        </div>
//    </div>
//</div>

module.exports = ArticleForm;
