'use strict';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import ClassIcon from '@mui/icons-material/Class';

import {
    fetchArticles,
    fetchTags,
    fetchUserRecents
} from '../../actions';

import {
    getUserRecentArticles
} from '../../selectors';

import {
    tagsPath,
    userHomePath
} from '../../constants/routesHelper';

import {
    homeHomeLimit,
    homePopularsLimit,
} from '../modules/constants';

import Loader from '../theme/loader';

import ArticleMiniCardDisplay from '../articles/display/items/miniCard';
import TagChipDisplay from '../tags/display/chip';
import MiniArticleSkeleton from '../loaders/skeletons/miniArticle';

export default @connect((state) => ({
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
})
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

        this.props.fetchUserRecents(this.props.isUserConnected ? this.props.currentUserId : null, {limit: 10});
    }

    render() {
        return (
            <section className="home-populars">
                <div className="home-homeContent">
                    {
                        this.props.currentUserSlug &&
                        <div className="home-popularsHomeButtonContainer">
                            <Button className="home-popularsHomeButton"
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
                        <div className="home-popularsCategory">
                            <h2 className="home-popularsTitle">
                                {I18n.t('js.views.home.recents.title')}
                            </h2>

                            <Grid container={true}
                                  spacing={4}
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="flex-start">
                                {
                                    this.props.recentArticles.limit(4).map((article) => (
                                        <Grid key={`recents-${article.id}`}
                                              item={true}
                                              xs={12}
                                              sm={6}>
                                            <ArticleMiniCardDisplay article={article}
                                                                    isPaper={true}/>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </div>
                    }

                    <div className="home-popularsCategory">
                        <h2 className="home-popularsTitle">
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
                                              item={true}
                                              xs={12}
                                              sm={6}>
                                            <ArticleMiniCardDisplay article={article}
                                                                    isPaper={true}/>
                                        </Grid>
                                    ))
                                    :
                                    <>
                                        <Grid item={true}
                                              xs={12}
                                              sm={6}>
                                            <MiniArticleSkeleton/>
                                        </Grid>
                                        <Grid item={true}
                                              xs={12}
                                              sm={6}>
                                            <MiniArticleSkeleton/>
                                        </Grid>
                                    </>
                            }
                        </Grid>
                    </div>

                    <Divider className="home-popularsDivider"/>

                    <div className="home-popularsCategory">
                        <h2 className="home-popularsSubtitle">
                            {I18n.t('js.views.home.populars.tags.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularTags?.length > 0
                                    ?
                                    this.props.popularTags.map((tag) => (
                                        <div key={`populars-tag-${tag.id}`}
                                             className="home-popularsTag">
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

                        <div className="home-popularsButton">
                            <Button color="primary"
                                    variant="contained"
                                    href={tagsPath()}>
                                {I18n.t('js.views.home.populars.tags.button')}
                            </Button>
                        </div>
                    </div>

                    <Divider className="home-popularsDivider"/>

                    <div className="home-popularsCategory">
                        <h2 className="home-popularsSubtitle">
                            {I18n.t('js.views.home.populars.articles.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularArticles?.length > 0
                                    ?
                                    this.props.popularArticles.filter((article) => !this.props.homeArticles.map((homeArticle) => homeArticle.id).includes(article.id)).map((article) => (
                                        <div key={`popular-${article.id}`}
                                             className="home-popularsItem">
                                            <ArticleMiniCardDisplay article={article}
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
