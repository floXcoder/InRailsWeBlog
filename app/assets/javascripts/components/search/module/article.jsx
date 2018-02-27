'use strict';

import {
    Link
} from 'react-router-dom';

export default class SearchArticleModule extends React.Component {
    static propTypes = {
        articles: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-category">
                <h2>
                    {I18n.t('js.search.module.articles.title')}
                </h2>

                <div className="shows-list">
                    {
                        this.props.articles.map((article) => (
                            <section key={article.id}
                                     className="search-card search-card-small">
                                <h3 className="search-card-title">
                                    <Link className="search-article-title"
                                          to={`/article/${article.slug}`}>
                                        {article.title || article.slug}
                                    </Link>
                                </h3>

                                <Link className="search-article-link"
                                      to={`/article/${article.slug}/edit`}>
                                    <span className="material-icons"
                                          data-icon="mode_edit"
                                          aria-hidden="true"/>
                                </Link>
                            </section>
                        ))
                    }
                </div>
            </div>
        );
    }
}
