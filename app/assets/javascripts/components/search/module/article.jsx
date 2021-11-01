'use strict';

import {
    Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';
// import EditIcon from '@material-ui/icons/Edit';

import {
    userArticlePath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import Loader from '../../theme/loader';

export default class SearchArticleModule extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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
            )).reverse();
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
                <Grid container={true}
                      spacing={2}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center">
                    <Grid className={this.props.classes.articleMainItem}
                          item={true}>
                        <Link className={classNames(this.props.classes.articleMainResult, {
                            [this.props.classes.articleSecondaryResult]: !primary,
                            [this.props.classes.articleHighlighted]: this.props.highlightedArticleId === article.id
                        })}
                              to={{
                                  pathname: userArticlePath(article.userSlug, article.slug),
                                  state: {
                                      highlightContent: article.contentHighlighted?.match(/>(.*?)<\//)?.splice(1, 1)?.toString()
                                  }
                              }}
                              onClick={this._handleArticleClick.bind(this, article)}>

                            <span className={this.props.classes.articleTitleResult}>
                                {article.title || article.slug}
                            </span>

                            {
                                article.contentHighlighted &&
                                <span className={this.props.classes.articleHighlightResult}>
                                    {
                                        this.props.hasParenthesis
                                            ?
                                            <span>
                                                (<span dangerouslySetInnerHTML={{__html: article.contentHighlighted}}/>)
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
                                      className={this.props.classes.articleTag}
                                      icon={this.props.hasTagIcon ? <LabelIcon/> : undefined}
                                      label={tagName}
                                      color="primary"
                                      variant="outlined"/>
                            ))
                        }
                    </Grid>

                    {/*<Grid item={true}>*/}
                    {/*    <Link to={editArticlePath(article.userSlug, article.slug)}>*/}
                    {/*        <EditIcon className={this.props.classes.articleEdit}/>*/}
                    {/*    </Link>*/}
                    {/*</Grid>*/}
                </Grid>
            </section>
        );
    };

    render() {
        const currentTopicArticles = this._currentTopicArticles();
        const otherTopicArticles = this._otherTopicArticles();
        const otherUserArticles = this._otherUserArticles();

        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.module.articles.title')}

                    {
                        (this.props.isUserConnected && !this.props.hasQuery) &&
                        <span className={this.props.classes.categoryCount}>
                            {I18n.t('js.search.module.articles.recents')}
                        </span>
                    }
                </h2>

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
                                <div className={this.props.classes.helpMessage}>
                                    {I18n.t('js.search.module.helpers.tagged_articles', {tags: this.props.selectedTags.map((tag) => tag.name).join(', ')})}
                                </div>
                            }

                            {
                                (this.props.hasQuery && this.props.articles.length === 0) &&
                                <p className={this.props.classes.articleSecondaryResult}>
                                    <em>{I18n.t('js.search.module.articles.none')}</em>
                                </p>
                            }

                            {
                                currentTopicArticles.map(this._renderArticleItem.bind(this, true))
                            }

                            {
                                Utils.isPresent(otherTopicArticles) &&
                                <>
                                    {
                                        Utils.isPresent(currentTopicArticles) &&
                                        <Divider className={this.props.classes.categoryDivider}
                                                 variant="fullWidth"/>
                                    }

                                    <h3 className={this.props.classes.otherArticlesTitle}>
                                        {I18n.t('js.search.module.articles.other_topics')}
                                    </h3>

                                    {
                                        otherTopicArticles.map(this._renderArticleItem.bind(this, false))
                                    }
                                </>
                            }

                            {
                                Utils.isPresent(otherUserArticles) &&
                                <>
                                    {
                                        (Utils.isPresent(currentTopicArticles) || Utils.isPresent(otherTopicArticles)) &&
                                        <Divider className={this.props.classes.categoryDivider}
                                                 variant="fullWidth"/>
                                    }

                                    <h3 className={this.props.classes.otherArticlesTitle}>
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
