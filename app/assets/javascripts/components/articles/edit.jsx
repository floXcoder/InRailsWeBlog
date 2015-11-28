'use strict';

var ArticleForm = require('./form');

require('../../modules/wysiwyg/summernote');
require('../../modules/wysiwyg/lang/summernote-en-US');
require('../../modules/wysiwyg/lang/summernote-fr-FR');

var ArticleEdit = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        multiLanguage: React.PropTypes.bool.isRequired
    },

    _onCancel () {
        window.location.replace("/articles/" + this.props.article.id);
        return true;
    },

    render () {
        let title = this.props.article.title ?
            I18n.t('js.article.edit.form_title', {title: this.props.article.title}) :
            I18n.t('js.article.edit.title');
        return (
            <div className="blog-form blog-article-edit">
                <h4 className="blog-form-title">
                    {title}
                </h4>
                <hr/>
                <ArticleForm article={this.props.article}
                             multiLanguage={this.props.multiLanguage}
                             onCancel={this._onCancel}>
                </ArticleForm>
            </div>

        );
    }
});

module.exports = ArticleEdit;
