'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

import Dropdown from '../../theme/dropdown';

export default class SearchArticleIndex extends React.Component {
    static propTypes = {
        articles: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired,
        onFilter: PropTypes.func.isRequired,
        onArticleClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleFilter = (filter, event) => {
        event.preventDefault();

        this.props.onFilter(filter);
    };

    _handleArticleClick = (article, event) => {
        event.preventDefault();

        this.props.onArticleClick(article);
    };

    render() {
        return (
            <div className="search-index-category">
                <h2>
                    {I18n.t('js.search.index.articles.title')}

                    <span className="search-index-count">
                        {`(${I18n.t('js.search.index.results', {count: this.props.articles.length})})`}
                    </span>

                    <div className="search-index-filter">
                        <Dropdown hasWavesEffect={false}
                                  buttonClassName="header-button"
                                  isClosingOnInsideClick={true}
                                  hasArrow={true}
                                  position="bottom right"
                                  button={
                                      <span>
                                        {I18n.t('js.search.index.filters.button')}
                                        <span className="material-icons"
                                              data-icon="filter_list"
                                              aria-hidden="true"/>
                                    </span>
                                  }>
                            <ul>
                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'priority')}>
                                        {I18n.t('js.search.filters.priority')}
                                    </a>
                                </li>

                                <li className="dropdown-divider">
                                    &nbsp;
                                </li>

                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'date')}>
                                        {I18n.t('js.search.filters.date')}
                                    </a>
                                </li>

                                <li className="dropdown-divider">
                                    &nbsp;
                                </li>

                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'all_topics')}>
                                        {I18n.t('js.search.filters.all_topics')}
                                    </a>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </h2>

                <div className="article-result-list">
                    {
                        this.props.articles.map((article) => (
                            <div key={article.id}
                                 className="article-item search-card-article"
                                 onClick={this._handleArticleClick.bind(this, article)}>
                                <div className="article-content">
                                    <div className="article-title">
                                        <Link to={`/article/${article.slug}`}
                                              onClick={spyTrackClick.bind(null, 'article', article.id, article.slug, article.title)}>
                                            <span className="title"
                                                  dangerouslySetInnerHTML={{__html: article.title}}/>
                                        </Link>

                                        <span className="article-subtitle">
                                            {`(${article.date} - ${article.user.pseudo})`}
                                        </span>
                                    </div>

                                    <div className="search-article-tags article-tags">
                                        {
                                            article.tags.map((tag) => (
                                                <div key={tag.id}
                                                     className="article-tag">
                                                    <Link className="tag-default"
                                                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}
                                                          to={`/article/tags/${tag.slug}`}>
                                                        {tag.name}
                                                    </Link>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="blog-article-content"
                                         dangerouslySetInnerHTML={{__html: article.content}}/>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
