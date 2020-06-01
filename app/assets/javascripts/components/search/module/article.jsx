'use strict';

import {
    Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

// import EditIcon from '@material-ui/icons/Edit';

import {
    userArticlePath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchArticleModule extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        isUserConnected: PropTypes.bool.isRequired,
        articles: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        selectedTags: PropTypes.array,
        highlightedArticleId: PropTypes.number,
        currentTopicId: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = (article) => {
        spyTrackClick('article', article.id, article.slug, article.title);
    };

    _currentTopicArticles = () => {
        if (this.props.currentTopicId) {
            return this.props.articles.filter((article) => (
                article.topicId === this.props.currentTopicId
            ));
        } else {
            return this.props.articles;
        }
    };

    _otherArticles = () => {
        if (this.props.currentTopicId) {
            return this.props.articles.filter((article) => (
                article.topicId !== this.props.currentTopicId
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
                      justify="flex-start"
                      alignItems="center">
                    <Grid className={this.props.classes.articleMainItem}
                          item={true}>
                        <Link className={classNames(this.props.classes.articleMainResult, {
                            [this.props.classes.articleSecondaryResult]: !primary,
                            [this.props.classes.articleHighlighted]: this.props.highlightedArticleId === article.id
                        })}
                              to={userArticlePath(article.user.slug, article.slug)}
                              onClick={this._handleArticleClick.bind(this, article)}>
                            {article.title || article.slug}

                            {
                                article.highlightedContent &&
                                <span className={this.props.classes.articleHighlightResult}>
                                     (<span dangerouslySetInnerHTML={{__html: article.highlightedContent}}/>)
                                </span>
                            }
                        </Link>

                        {
                            article.tagNames?.map((tagName) => (
                                <Chip key={tagName}
                                      className={this.props.classes.articleTag}
                                      label={tagName}
                                      color="primary"
                                      variant="outlined"/>
                            ))
                        }
                    </Grid>

                    {/*<Grid item={true}>*/}
                    {/*    <Link to={editArticlePath(article.user.slug, article.slug)}>*/}
                    {/*        <EditIcon className={this.props.classes.articleEdit}/>*/}
                    {/*    </Link>*/}
                    {/*</Grid>*/}
                </Grid>
            </section>
        );
    };

    render() {
        const currentTopicArticles = this._currentTopicArticles();
        const otherArticles = this._otherArticles();

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

                <div>
                    {
                        this.props.selectedTags.length > 0 &&
                        <div className={this.props.classes.helpMessage}>
                            {I18n.t('js.search.module.helpers.tagged_articles', {tags: this.props.selectedTags.map((tag) => tag.name).join(', ')})}
                        </div>
                    }

                    {
                        (this.props.hasQuery && currentTopicArticles.length === 0 && otherArticles.length === 0) &&
                        <p className={this.props.classes.articleSecondaryResult}>
                            {I18n.t('js.search.module.articles.none')}
                        </p>
                    }

                    {
                        currentTopicArticles.map(this._renderArticleItem.bind(this, true))
                    }

                    {
                        !Utils.isEmpty(otherArticles) &&
                        <>
                            {
                                !Utils.isEmpty(currentTopicArticles) &&
                                <Divider className={this.props.classes.categoryDivider}
                                         variant="fullWidth"/>
                            }

                            {
                                otherArticles.map(this._renderArticleItem.bind(this, false))
                            }
                        </>
                    }
                </div>
            </div>
        );
    }
}
