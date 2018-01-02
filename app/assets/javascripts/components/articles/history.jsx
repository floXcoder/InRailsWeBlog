'use strict';

export default class ArticleHistory extends React.Component {
    static propTypes = {
        articleVersions: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

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

        // TODO
        // ArticleActions.restoreArticle({restore: articleToRestore});
    };

    render() {
        if (this.props.articleVersions.length === 0) {
            Notification.alert(I18n.t('js.article.history.none'));
            return null;
        }

        return (
            <ul className="blog-article-history collapsible popout"
                data-collapsible="accordion">
                {
                    this.props.articleVersions.map((version) => (
                        <li key={version.id}>
                            <div className="collapsible-header">
                                    <span className="material-icons"
                                          data-icon="change_history"
                                          aria-hidden="true"/>
                                {I18n.t('js.article.history.changed_at') + ' ' + version.changed_at}
                            </div>

                            <div className="collapsible-body article-history-item blog-article-item">
                                <span className="blog-article-content"
                                      dangerouslySetInnerHTML={{__html: version.article.content}}/>

                                <hr className="article-history-item-divider"/>

                                <a className="btn-small waves-effect waves-light"
                                   onClick={this._handleRestoreClick.bind(this, version.article.id, version.id)}>
                                    {I18n.t('js.article.history.restore')}
                                </a>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }
}
