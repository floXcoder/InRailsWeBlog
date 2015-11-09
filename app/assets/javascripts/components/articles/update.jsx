var ArticleForm = require('../../components/articles/form');

var ArticleUpdate = React.createClass({
    getInitialState: function () {
        return {};
    },

    render: function () {
        var title = this.props.article.title ?
            I18n.t('js.article.edit.form_title', {title: this.props.article.title}) :
            I18n.t('js.article.edit.title');
        return (
            <div className="blog-form blog-article-edit">
                <h4 className="blog-form-title">
                    {title}
                </h4>
                <hr/>
                <ArticleForm article={this.props.article}
                             tags={this.props.article.tags}
                             multiLanguage={this.props.multiLanguage}>
                </ArticleForm>
            </div>

        );
    }
});

module.exports = ArticleUpdate;
