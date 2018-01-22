'use strict';

export default class ArticleVersionsDisplay extends React.Component {
    static propTypes = {
        articleVersions: PropTypes.array.isRequired,
        onRestore: PropTypes.func.isRequired
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
        this.props.onRestore(articleId, versionId);
    };

    render() {
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
                                {`${I18n.t('js.article.history.changed_at')} ${version.changedAt}`}
                            </div>

                            <div className="collapsible-body article-history-item blog-article-item">
                                <h3 className="article-title-card">
                                    {version.article.title}
                                </h3>

                                <div className="blog-article-content"
                                      dangerouslySetInnerHTML={{__html: version.article.content}}/>

                                <hr className="article-history-item-divider"/>

                                <a className="btn-small waves-effect waves-light"
                                   href="#"
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
