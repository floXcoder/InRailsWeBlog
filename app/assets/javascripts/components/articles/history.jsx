"use strict";

var ArticleActions = require('../../actions/articleActions');

var ArticleHistory = React.createClass({
    propTypes: {
        articleVersions: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $('.blog-article-history.collapsible').collapsible();
    },

    componentDidUpdate: function () {
        $('.blog-article-history.collapsible').collapsible();
    },

    _restoreArticle: function (articleId, versionId) {
        var articleToRestore = {
            articleId: articleId,
            versionId: versionId
        };
        ArticleActions.restoreArticle({restore: articleToRestore});
    },

    render: function () {
        if (this.props.articleVersions) {
            var Versions = this.props.articleVersions.map(function (version) {
                if(!$.isEmpty(version.article.content)) {
                    return (
                        <li className="" key={version.id}>
                            <div className="collapsible-header">
                                <i className="material-icons">change_history</i>
                                {I18n.t('js.article.history.changed_at') + ' ' + version.changed_at}
                            </div>
                            <div className="collapsible-body article-history-item blog-article-item">
                                <span dangerouslySetInnerHTML={{__html: version.article.content}}/>
                                <hr className="article-history-item-divider"/>
                                <a className="waves-effect waves-light btn-small"
                                   onClick={this._restoreArticle.bind(this, version.article.id, version.id)}>
                                    {I18n.t('js.article.history.restore')}
                                </a>
                            </div>
                        </li>
                    );
                }
            }.bind(this));

            if($.isEmpty(Versions)) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }

            return (
                <ul className="blog-article-history collapsible popout" data-collapsible="accordion">
                    {Versions}
                </ul>
            );
        } else {
            return null;
        }

    }
});

module.exports = ArticleHistory;
