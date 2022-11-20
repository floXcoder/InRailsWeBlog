'use strict';

import '../../../stylesheets/pages/user/home.scss';

import {
    Link
} from 'react-router-dom';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import {
    topicArticlesPath,
    userTopicPath,
    newTopicParam,
    sortTopicParam
} from '../../constants/routesHelper';

import {
    fetchMetaTags,
    spyTrackClick,
    switchTagSidebar
} from '../../actions';

import {
    getPublicTopics,
    getPrivateTopics,
    getUserRecentArticles,
    getUserRecentUpdatedArticles
} from '../../selectors';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import ArticleMiniCardDisplay from '../articles/display/items/miniCard';


export default @connect((state) => ({
    isFetching: state.userState.isFetching,
    userSlug: state.userState.currentSlug,
    user: state.userState.user,
    publicTopics: getPublicTopics(state),
    privateTopics: getPrivateTopics(state),
    contributedTopics: state.topicState.contributedTopics,
    recentArticles: getUserRecentArticles(state),
    recentUpdatedArticles: getUserRecentUpdatedArticles(state)
}), {
    fetchMetaTags,
    switchTagSidebar
})
class UserHome extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        userSlug: PropTypes.string,
        user: PropTypes.object,
        publicTopics: PropTypes.array,
        privateTopics: PropTypes.array,
        contributedTopics: PropTypes.array,
        recentArticles: PropTypes.array,
        recentUpdatedArticles: PropTypes.array,
        fetchMetaTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchMetaTags('user_home', {user_slug: this.props.userSlug});
    }

    _handleTopicClick = (topic) => {
        spyTrackClick('topic', topic.id, topic.slug, topic.userId, topic.name, null);
    };

    render() {
        if (!this.props.user) {
            if (this.props.isFetching) {
                return (
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                );
            } else {
                return (
                    <div className="center margin-top-20">
                        <NotFound/>
                    </div>
                );
            }
        }

        return (
            <div className="user-home-user-home">
                <div className="row user-home-topics">
                    <div className="col s12 xl6">
                        <Card component="section"
                              className="user-home-card"
                              elevation={6}>
                            <CardHeader classes={{
                                root: 'user-home-header',
                                title: 'user-home-header-title',
                                subheader: 'user-home-header-subheader'
                            }}
                                        title={I18n.t('js.user.home.private.title')}
                                        subheader={I18n.t('js.user.home.private.subtitle')}
                                        action={
                                            <IconButton className="user-home-sort-icon"
                                                        component={Link}
                                                        aria-label="Show more"
                                                        to={{
                                                            hash: '#' + sortTopicParam
                                                        }}
                                                        state={{
                                                            visibility: 'only_me'
                                                        }}
                                                        size="large">
                                                <CompareArrowsIcon/>
                                            </IconButton>
                                        }/>

                            <CardContent>
                                <Grid container={true}
                                      spacing={4}
                                      direction="row"
                                      justifyContent="flex-start"
                                      alignItems="center">
                                    {
                                        this.props.privateTopics.map((topic) => (
                                            <Grid key={topic.id}
                                                  className="user-home-grid-theme"
                                                  item={true}
                                                  xs={12}
                                                  sm={6}>
                                                <Link to={{
                                                    pathname: topicArticlesPath(this.props.user.slug, topic.slug)
                                                }}
                                                      onClick={this._handleTopicClick.bind(this, topic)}>
                                                    <Paper className={classNames('user-home-topic', {
                                                        'user-home-story-topic': topic.mode === 'stories'
                                                    })}
                                                           elevation={1}>
                                                        <Typography className="user-home-topic-title"
                                                                    variant="h5"
                                                                    component="h2">
                                                            {topic.name}
                                                        </Typography>

                                                        {
                                                            topic.mode !== 'default' &&
                                                            <div className="user-home-topic-mode">
                                                                {I18n.t(`js.topic.enums.mode.${topic.mode}`)}
                                                            </div>
                                                        }
                                                    </Paper>
                                                </Link>

                                                <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                                    <Fab className={classNames('user-home-topic-link', {
                                                        'user-home-story-topic-link': topic.mode === 'stories'
                                                    })}
                                                         variant="extended"
                                                         size="small"
                                                         color="primary"
                                                         aria-label="Share">
                                                        <OpenInNewIcon/>
                                                    </Fab>
                                                </Link>
                                            </Grid>
                                        ))
                                    }

                                    <Grid item={true}
                                          xs={12}
                                          sm={6}>
                                        <Link to={{
                                            hash: '#' + newTopicParam
                                        }}
                                              state={{
                                                  mode: 'default',
                                                  visibility: 'only_me'
                                              }}>
                                            <Paper className="user-home-topic-new"
                                                   elevation={1}>
                                                <Typography className="user-home-topic-new-title"
                                                            variant="h5"
                                                            component="h2">
                                                    {I18n.t('js.user.home.add_topic')}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col s12 xl6">
                        <Card component="section"
                              className="user-home-card"
                              elevation={5}>
                            <CardHeader classes={{
                                root: 'user-home-header',
                                title: 'user-home-header-title',
                                subheader: 'user-home-header-subheader'
                            }}
                                        title={I18n.t('js.user.home.public.title')}
                                        subheader={I18n.t('js.user.home.public.subtitle')}
                                        action={
                                            <IconButton className="user-home-sort-icon"
                                                        component={Link}
                                                        to={{
                                                            hash: '#' + sortTopicParam
                                                        }}
                                                        state={{
                                                            visibility: 'everyone'
                                                        }}
                                                        size="large">
                                                <CompareArrowsIcon/>
                                            </IconButton>
                                        }/>

                            <CardContent>
                                <Grid container={true}
                                      spacing={4}
                                      direction="row"
                                      justifyContent="flex-start"
                                      alignItems="center">
                                    {
                                        this.props.publicTopics.map((topic) => (
                                            <Grid key={topic.id}
                                                  className="user-home-grid-theme"
                                                  item={true}
                                                  xs={12}
                                                  sm={6}>
                                                <Link to={{
                                                    pathname: topicArticlesPath(this.props.user.slug, topic.slug)
                                                }}
                                                      onClick={this._handleTopicClick.bind(this, topic)}>
                                                    <Paper className="user-home-topic"
                                                           elevation={1}>
                                                        <Typography className="user-home-topic-title"
                                                                    variant="h5"
                                                                    component="h2">
                                                            {topic.name}
                                                        </Typography>

                                                        {
                                                            topic.languages.length > 1 &&
                                                            <div className="user-home-topic-languages">
                                                                {topic.languages.join(', ')}
                                                            </div>
                                                        }

                                                        {
                                                            topic.mode !== 'default' &&
                                                            <div className="user-home-topic-mode">
                                                                {I18n.t(`js.topic.enums.mode.${topic.mode}`)}
                                                            </div>
                                                        }
                                                    </Paper>
                                                </Link>

                                                <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                                    <Fab className="user-home-topic-link"
                                                         variant="extended"
                                                         size="small"
                                                         color="primary"
                                                         aria-label="Share">
                                                        <OpenInNewIcon/>
                                                    </Fab>
                                                </Link>
                                            </Grid>
                                        ))
                                    }

                                    <Grid item={true}
                                          xs={12}
                                          sm={6}>
                                        <Link to={{
                                            hash: '#' + newTopicParam
                                        }}
                                              state={{
                                                  mode: 'default',
                                                  visibility: 'everyone'
                                              }}>
                                            <Paper className="user-home-topic-new"
                                                   elevation={1}>
                                                <Typography className="user-home-topic-new-title"
                                                            variant="h5"
                                                            component="h2">
                                                    {I18n.t('js.user.home.add_topic')}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                    </div>

                    {
                        this.props.contributedTopics.length > 0 &&
                        <div className="col s12">
                            <Divider/>

                            <Card component="section"
                                  className="user-home-card"
                                  elevation={5}>
                                <CardHeader classes={{
                                    root: 'user-home-header',
                                    title: 'user-home-header-title',
                                    subheader: 'user-home-header-subheader'
                                }}
                                            title={I18n.t('js.user.home.shared.title')}
                                            subheader={I18n.t('js.user.home.shared.subtitle')}/>

                                <CardContent>
                                    <Grid container={true}
                                          spacing={4}
                                          direction="row"
                                          justifyContent="flex-start"
                                          alignItems="center">
                                        {
                                            this.props.contributedTopics.map((topic) => (
                                                <Grid key={topic.id}
                                                      className="user-home-grid-theme"
                                                      item={true}
                                                      xs={12}
                                                      sm={6}>
                                                    <Link to={{
                                                        pathname: topicArticlesPath(this.props.user.slug, topic.slug, 'shared-topics'),
                                                    }}
                                                          onClick={this._handleTopicClick.bind(this, topic)}>
                                                        <Paper className="user-home-topic"
                                                               elevation={1}>
                                                            <Typography className="user-home-topic-title"
                                                                        variant="h5"
                                                                        component="h2">
                                                                {topic.name}
                                                            </Typography>
                                                        </Paper>
                                                    </Link>

                                                    <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                                        <Fab className="user-home-topic-link"
                                                             variant="extended"
                                                             size="small"
                                                             color="primary"
                                                             aria-label="Share">
                                                            <OpenInNewIcon/>
                                                        </Fab>
                                                    </Link>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                    }
                </div>

                <div className="user-home-articles">
                    {/*<Divider className="user-home-divider"/>*/}

                    <div>
                        <h2 className="user-home-articles-title">
                            {I18n.t('js.user.home.articles.seen')}
                        </h2>

                        <Grid container={true}
                              spacing={4}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start">
                            {
                                this.props.recentArticles?.length > 0 &&
                                this.props.recentArticles.limit(6)
                                    .map((article) => (
                                        <Grid key={article.id}
                                              item={true}
                                              xs={12}
                                              sm={6}
                                              md={4}>
                                            <ArticleMiniCardDisplay article={article}
                                                                    isFaded={true}
                                                                    isPaper={true}/>
                                        </Grid>
                                    ))
                            }
                        </Grid>
                    </div>

                    {/*<Divider className="user-home-divider"/>*/}

                    <div>
                        <h2 className="user-home-articles-title">
                            {I18n.t('js.user.home.articles.modified')}
                        </h2>

                        <Grid container={true}
                              spacing={4}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start">
                            {
                                this.props.recentUpdatedArticles?.length > 0 &&
                                this.props.recentUpdatedArticles.limit(6)
                                    .map((article) => (
                                        <Grid key={article.id}
                                              item={true}
                                              xs={12}
                                              sm={6}
                                              md={4}>
                                            <ArticleMiniCardDisplay article={article}
                                                                    isFaded={true}
                                                                    isPaper={true}/>
                                        </Grid>
                                    ))
                            }
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}
