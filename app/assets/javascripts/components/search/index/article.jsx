'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

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
                                 className="article-item search-card-article"
                                 onClick={this._handleArticleClick.bind(this, article)}>
                                <div className="article-content">
                                    <div className="article-title">
                                        <Link to={`/article/${article.slug}`}
                                              onClick={spyTrackClick.bind(null, 'article', article.id)}>
                                            <div className="title"
                                                 dangerouslySetInnerHTML={{__html: article.title}}/>
                                        </Link>
                                    </div>

                                    <div className="blog-article-content"
                                         dangerouslySetInnerHTML={{__html: article.content}}/>

                                    <div className="blog-article-info article-tags">
                                        {
                                            article.tags.map((tag) => (
                                                <div key={tag.id}
                                                     className="article-tag">
                                                    <Link className="tag-default"
                                                          onClick={spyTrackClick.bind(null, 'tag', tag.id)}
                                                          to={`/article/tags/${tag.slug}`}>
                                                        {tag.name}
                                                    </Link>
                                                </div>
                                            ))
                                        }
                                    </div>


                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
