'use strict';

import {
    Link
} from 'react-router-dom';

import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import LabelIcon from '@mui/icons-material/Label';
// import EditIcon from '@mui/icons-material/Edit';

import {
    userArticlePath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import Loader from '../../theme/loader';


export default class SearchArticleModule extends React.PureComponent {
    static propTypes = {
        isSearching: PropTypes.bool.isRequired,
        isUserConnected: PropTypes.bool.isRequired,
        articles: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        hasParenthesis: PropTypes.bool,
        hasTagIcon: PropTypes.bool,
        selectedTags: PropTypes.array,
        highlightedArticleId: PropTypes.number,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number
    };

    static defaultProps = {
        hasParenthesis: true,
        hasTagIcon: false
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = (article) => {
        spyTrackClick('article', article.id, article.slug, article.userId, article.title, article.topicId);
    };

    _currentTopicArticles = () => {
        if (this.props.currentTopicId) {
            return this.props.articles.filter((article) => (
                article.userId === this.props.currentUserId && article.topicId === this.props.currentTopicId
            ));
        } else {
            return this.props.articles;
        }
    };

    _otherTopicArticles = () => {
        if (this.props.currentTopicId) {
            return this.props.articles.filter((article) => (
                article.userId === this.props.currentUserId && article.topicId !== this.props.currentTopicId
            ))
                .reduce((articlesByTopics, article) => {
                    if (!articlesByTopics[article.topicName]) {
                        articlesByTopics[article.topicName] = [];
                    }

                    articlesByTopics[article.topicName].push(article);

                    return articlesByTopics;
                }, {});
        } else {
            return [];
        }
    };

    _otherUserArticles = () => {
        if (this.props.currentUserId) {
            return this.props.articles.filter((article) => (
                article.userId !== this.props.currentUserId
            ));
        } else {
            return [];
        }
    };

    _renderArticleItem = (primary, article) => {
        return (
            <section key={article.id}>
                <Grid className="search-module-article-main"
                      container={true}
                      spacing={2}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center">
                    <Grid className="search-module-article-main-item"
                          >
                        <Link className={classNames('search-module-article-main-result', {
                            'search-module-article-secondary-result': !primary,
                            'search-module-article-highlighted': this.props.highlightedArticleId === article.id
                        })}
                              to={{
                                  pathname: userArticlePath(article.userSlug, article.slug)
                              }}
                              state={{
                                  highlightContent: article.contentHighlighted?.match(/>(.*?)<\//)
                                      ?.splice(1, 1)
                                      ?.toString()
                              }}
                              onClick={this._handleArticleClick.bind(this, article)}>

                            <span className="search-module-article-title-result"
                                  dangerouslySetInnerHTML={{__html: article.titleHighlighted || article.title || article.slug}}/>

                            {
                                !!article.contentHighlighted &&
                                <span className="search-module-article-highlight-result">
                                    {
                                        this.props.hasParenthesis
                                            ?
                                            <span>
                                                (
<span dangerouslySetInnerHTML={{__html: article.contentHighlighted}}/>
)
                                            </span>
                                            :
                                            <span dangerouslySetInnerHTML={{__html: article.contentHighlighted}}/>
                                    }
                                </span>
                            }
                        </Link>

                        {
                            article.tagNames?.map((tagName) => (
                                <Chip key={tagName}
                                      className="search-module-article-tag"
                                      icon={this.props.hasTagIcon ? <LabelIcon/> : undefined}
                                      label={tagName}
                                      color="primary"
                                      variant="outlined"/>
                            ))
                        }
                    </Grid>

                    {/*<Grid >*/}
                    {/*    <Link to={editArticlePath(article.userSlug, article.slug)}>*/}
                    {/*        <EditIcon className={search-module-articleEdit}/>*/}
                    {/*    </Link>*/}
                    {/*</Grid>*/}
                </Grid>
            </section>
        );
    };

    render() {
        const currentTopicArticles = this._currentTopicArticles();
        const articlesByTopics = this._otherTopicArticles();
        const otherUserArticles = this._otherUserArticles();

        return (
            <div className="search-module-category">
                {
                    (!!this.props.isUserConnected || !!this.props.hasQuery) &&
                    <h2 className="search-module-category-name">
                        {I18n.t('js.search.module.articles.title')}

                        {
                            (!!this.props.isUserConnected && !this.props.hasQuery) &&
                            <span className="search-module-category-count">
                                {I18n.t('js.search.module.articles.recents')}
                            </span>
                        }
                    </h2>
                }

                {
                    this.props.isSearching
                        ?
                        <div className="search-module-searching">
                            <Loader size="big"/>
                        </div>
                        :
                        <div>
                            {
                                this.props.selectedTags.length > 0 &&
                                <div className="search-module-help-message">
                                    {I18n.t('js.search.module.helpers.tagged_articles', {
                                        tags: this.props.selectedTags.map((tag) => tag.name)
                                            .join(', ')
                                    })}
                                </div>
                            }

                            {
                                !!(this.props.hasQuery && this.props.articles.length === 0) &&
                                <p className="search-module-article-none">
                                    <em>{I18n.t('js.search.module.articles.none')}</em>
                                </p>
                            }

                            {
                                currentTopicArticles.map(this._renderArticleItem.bind(this, true))
                            }

                            {
                                Utils.isPresent(articlesByTopics) &&
                                Object.entries(articlesByTopics)
                                    .map(([topicName, articles], i) => (
                                        <React.Fragment key={topicName}>
                                            {
                                                (i !== 0 || Utils.isPresent(currentTopicArticles)) &&
                                                <Divider className="search-module-category-divider"
                                                         variant="fullWidth"/>
                                            }

                                            <h3 className="search-module-other-articles-title">
                                                {I18n.t('js.search.module.articles.other_topics', {topic: topicName})}
                                            </h3>

                                            {
                                                articles.map(this._renderArticleItem.bind(this, false))
                                            }
                                        </React.Fragment>
                                    ))
                            }

                            {
                                Utils.isPresent(otherUserArticles) &&
                                <>
                                    {
                                        (Utils.isPresent(currentTopicArticles) || Utils.isPresent(otherUserArticles)) &&
                                        <Divider className="search-module-category-divider"
                                                 variant="fullWidth"/>
                                    }

                                    <h3 className="search-module-other-articles-title">
                                        {I18n.t('js.search.module.articles.other_users')}
                                    </h3>

                                    {
                                        otherUserArticles.map(this._renderArticleItem.bind(this, false))
                                    }
                                </>
                            }
                        </div>
                }
            </div>
        );
    }
}
