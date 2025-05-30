import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import ClassIcon from '@mui/icons-material/Class';

import I18n from '@js/modules/translations';

import {
    fetchArticles
} from '@js/actions/articleActions';

import {
    fetchTags
} from '@js/actions/tagActions';

import {
    fetchUserRecents
} from '@js/actions/userActions';

import {
    getUserRecentArticles
} from '@js/selectors/userSelectors';

import {
    tagsPath,
    userHomePath
} from '@js/constants/routesHelper';

import {
    homeHomeLimit,
    homePopularsLimit,
    recentArticlesLimit
} from '@js/components/modules/constants';

import Loader from '@js/components/theme/loader';

import ArticleMiniCardDisplay from '@js/components/articles/display/items/miniCard';
import TagChipDisplay from '@js/components/tags/display/chip';
import MiniArticleSkeleton from '@js/components/loaders/skeletons/miniArticle';


class HomePopulars extends React.Component {
    static propTypes = {
        // from connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        homeArticles: PropTypes.array,
        popularArticles: PropTypes.array,
        popularTags: PropTypes.array,
        currentUserSlug: PropTypes.string,
        recentArticles: PropTypes.array,
        fetchArticles: PropTypes.func,
        fetchTags: PropTypes.func,
        fetchUserRecents: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({}, {
            home: true,
            summary: true,
            limit: homeHomeLimit
        }, {
            home: true
        });

        this.props.fetchArticles({}, {
            populars: true,
            summary: true,
            limit: homePopularsLimit
        }, {
            populars: true
        });

        this.props.fetchTags({}, {
            populars: true,
            limit: homePopularsLimit
        }, {
            populars: true
        });

        this.props.fetchUserRecents(this.props.isUserConnected ? this.props.currentUserId : null, {limit: recentArticlesLimit});
    }

    render() {
        return (
            <section className="home-populars">
                <div className="home-home-content">
                    {
                        !!this.props.currentUserSlug &&
                        <div className="home-populars-home-button-container">
                            <Button className="home-populars-home-button"
                                    color="secondary"
                                    variant="contained"
                                    startIcon={<ClassIcon/>}
                                    href={userHomePath(this.props.currentUserSlug)}>
                                {I18n.t('js.views.home.populars.user_home')}
                            </Button>
                        </div>
                    }

                    {
                        this.props.recentArticles?.length > 0 &&
                        <div className="home-populars-category">
                            <h2 className="home-populars-title">
                                {I18n.t('js.views.home.recents.title')}
                            </h2>

                            <Grid container={true}
                                  spacing={4}
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="flex-start">
                                {
                                    this.props.recentArticles.limit(4)
                                        .map((article) => (
                                            <Grid key={`recents-${article.id}`}
                                                  size={{
                                                      xs: 12,
                                                      sm: 6
                                                  }}>
                                                <ArticleMiniCardDisplay article={article}
                                                                        isFaded={true}
                                                                        isPaper={true}/>
                                            </Grid>
                                        ))
                                }
                            </Grid>
                        </div>
                    }

                    <div className="home-populars-category">
                        <h2 className="home-populars-title">
                            {I18n.t('js.views.home.populars.title')}
                        </h2>

                        <Grid container={true}
                              spacing={4}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start">
                            {
                                this.props.homeArticles?.length > 0
                                    ?
                                    this.props.homeArticles.map((article) => (
                                        <Grid key={`home-${article.id}`}
                                              size={{
                                                  xs: 12,
                                                  sm: 6
                                              }}>
                                            <ArticleMiniCardDisplay article={article}
                                                                    isFaded={true}
                                                                    isPaper={true}/>
                                        </Grid>
                                    ))
                                    :
                                    <>
                                        <Grid size={{
                                            xs: 12,
                                            sm: 6
                                        }}>
                                            <MiniArticleSkeleton/>
                                        </Grid>
                                        <Grid size={{
                                            xs: 12,
                                            sm: 6
                                        }}>
                                            <MiniArticleSkeleton/>
                                        </Grid>
                                    </>
                            }
                        </Grid>
                    </div>

                    <Divider className="home-populars-divider"/>

                    <div className="home-populars-category">
                        <h2 className="home-populars-subtitle">
                            {I18n.t('js.views.home.populars.tags.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularTags?.length > 0
                                    ?
                                    this.props.popularTags.map((tag) => (
                                        <div key={`populars-tag-${tag.id}`}
                                             className="home-populars-tag">
                                            <TagChipDisplay tag={tag}
                                                            isLarge={true}/>
                                        </div>
                                    ))
                                    :
                                    <div className="center">
                                        <Loader size="big"/>
                                    </div>
                            }
                        </div>

                        <div className="home-populars-button">
                            <Button color="primary"
                                    variant="contained"
                                    href={tagsPath()}>
                                {I18n.t('js.views.home.populars.tags.button')}
                            </Button>
                        </div>
                    </div>

                    <Divider className="home-populars-divider"/>

                    <div className="home-populars-category">
                        <h2 className="home-populars-subtitle">
                            {I18n.t('js.views.home.populars.articles.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularArticles?.length > 0
                                    ?
                                    this.props.popularArticles.filter((article) => !this.props.homeArticles.map((homeArticle) => homeArticle.id)
                                        .includes(article.id))
                                        .map((article) => (
                                            <div key={`popular-${article.id}`}
                                                 className="home-populars-item">
                                                <ArticleMiniCardDisplay article={article}
                                                                        isFaded={true}
                                                                        isPaper={true}/>
                                            </div>
                                        ))
                                    :
                                    <div>
                                        <MiniArticleSkeleton/>
                                        <MiniArticleSkeleton/>
                                        <MiniArticleSkeleton/>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    homeArticles: state.articleState.homeArticles,
    popularArticles: state.articleState.popularArticles,
    popularTags: state.tagState.popularTags,
    currentUserSlug: state.userState.currentSlug,
    recentArticles: getUserRecentArticles(state)
}), {
    fetchArticles,
    fetchTags,
    fetchUserRecents
})(HomePopulars);
