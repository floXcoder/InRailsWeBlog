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
                                    {article.title}
                                </h3>

                                <Link className="search-article-link"
                                      to={`/article/${article.slug}`}>
                                    <span className="material-icons"
                                          data-icon="open_in_new"
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
