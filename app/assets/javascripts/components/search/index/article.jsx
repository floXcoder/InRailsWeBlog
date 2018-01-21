'use strict';

import {
    Link
} from 'react-router-dom';

import UserAvatarIcon from '../../users/icons/avatar';

export default class SearchArticleIndex extends React.Component {
    static propTypes = {
        articles: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired,
        onArticleClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = (article, event) => {
        event.preventDefault();

        this.props.onArticleClick(article);
    };

    render() {
        return (
            <div className="search-index-category">
                <h2>
                    {I18n.t('js.search.module.articles.title')}
                </h2>

                <div className="shows-list">
                    {
                        this.props.articles.map((article) => (
                            <div key={article.id}
                                 className="card card-small search-card-article"
                                 onClick={this._handleArticleClick.bind(this, article)}>
                                <div className="card-content">
                                    <UserAvatarIcon user={article.user}
                                                    className="article-user"/>

                                    <Link className="card-title"
                                          to={`/article/${article.slug}`}
                                          dangerouslySetInnerHTML={{__html: article.title}}/>

                                    <div className="article-content"
                                         dangerouslySetInnerHTML={{__html: article.content}}/>

                                    {
                                        article.tags.map((tag) => (
                                            <div key={tag.id}
                                                 className="article-tag">
                                                <Link className="btn-small waves-effect waves-light tag-default"
                                                      to={`/article/tags/${tag.slug}`}>
                                                    {tag.name}
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
