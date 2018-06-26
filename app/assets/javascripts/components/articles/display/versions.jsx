'use strict';

import ReactDOMServer from 'react-dom/server';

import Diff from '../../theme/diff';

export default class ArticleVersionsDisplay extends React.Component {
    static propTypes = {
        currentArticle: PropTypes.object.isRequired,
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
                    this.props.articleVersions.map((version, i) => {
                        return (
                            <li key={version.id}>
                                <div className="collapsible-header">
                                        <span className="material-icons"
                                              data-icon="change_history"
                                              aria-hidden="true"/>
                                    {`${I18n.t('js.article.history.changed_at')} ${version.changedAt}`}
                                </div>

                                <div className="collapsible-body article-history-item blog-article-item">
                                    <h3 className="article-title-card">
                                        {
                                            i < this.props.articleVersions.length - 1
                                                ?
                                                <Diff current={this.props.articleVersions[i + 1].article.title}
                                                      previous={i === 0 ? this.props.currentArticle.title : version.article.title}
                                                      type="chars"/>
                                                :
                                                version.article.title
                                        }
                                    </h3>

                                    <div className="blog-article-content">
                                        {
                                            i < this.props.articleVersions.length - 1
                                                ?
                                                <div dangerouslySetInnerHTML={{
                                                    __html: ReactDOMServer.renderToString(<Diff
                                                        current={this.props.articleVersions[i + 1].article.content}
                                                        previous={i === 0 ? this.props.currentArticle.content : version.article.content}
                                                        type="words"/>)
                                                }}/>
                                                :
                                                <div dangerouslySetInnerHTML={{__html: version.article.content}}/>
                                        }
                                    </div>

                                    <hr className="article-history-item-divider"/>

                                    <a className="btn-small waves-effect waves-light"
                                       href="#"
                                       onClick={this._handleRestoreClick.bind(this, version.article.id, version.id)}>
                                        {I18n.t('js.article.history.restore')}
                                    </a>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}
