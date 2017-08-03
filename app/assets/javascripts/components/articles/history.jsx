'use strict';

import ArticleActions from '../../actions/articleActions';

export default class ArticleHistory extends React.Component {
    static propTypes = {
        articleVersions: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {};

    componentDidMount() {
        $('.blog-article-history.collapsible').collapsible();
    }

    componentDidUpdate() {
        $('.blog-article-history.collapsible').collapsible();
    }

    _handleRestoreClick = (articleId, versionId) => {
        let articleToRestore = {
            articleId: articleId,
            versionId: versionId
        };

        ArticleActions.restoreArticle({restore: articleToRestore});
    };

    render() {
        if (this.props.articleVersions.length > 0) {
            return (
                <ul className="blog-article-history collapsible popout"
                    data-collapsible="accordion">
                    {
                        this.props.articleVersions.map((version) => (
                                <li key={version.id}>
                                    <div className="collapsible-header">
                                        <i className="material-icons">change_history</i>
                                        {I18n.t('js.article.history.changed_at') + ' ' + version.changed_at}
                                    </div>

                                    <div className="collapsible-body article-history-item blog-article-item">
                                <span className="blog-article-content"
                                      dangerouslySetInnerHTML={{__html: version.article.content}}/>

                                        <hr className="article-history-item-divider"/>

                                        <a className="waves-effect waves-light btn-small"
                                           onClick={this._handleRestoreClick.bind(this, version.article.id, version.id)}>
                                            {I18n.t('js.article.history.restore')}
                                        </a>
                                    </div>
                                </li>
                            )
                        )
                    }
                </ul>
            );
        } else {
            Notification.alert(I18n.t('js.article.history.none'));
            return null;
        }
    }
}
