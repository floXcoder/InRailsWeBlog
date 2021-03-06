'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

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
    getPrivateTopics
} from '../../selectors';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import styles from '../../../jss/user/home';

export default @connect((state) => ({
    isFetching: state.userState.isFetching,
    userSlug: state.userState.currentSlug,
    user: state.userState.user,
    publicTopics: getPublicTopics(state),
    privateTopics: getPrivateTopics(state),
    contributedTopics: state.topicState.contributedTopics
}), {
    fetchMetaTags,
    switchTagSidebar
})
@hot
@withStyles(styles)
class UserHome extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        userSlug: PropTypes.string,
        user: PropTypes.object,
        publicTopics: PropTypes.array,
        privateTopics: PropTypes.array,
        contributedTopics: PropTypes.array,
        fetchMetaTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
                )
            } else {
                return (
                    <div className="center margin-top-20">
                        <NotFound/>
                    </div>
                )
            }
        }

        return (
            <div className={this.props.classes.root}>
                <Card component="section"
                      className={this.props.classes.card}
                      elevation={6}>
                    <CardHeader classes={{
                        root: this.props.classes.header,
                        subheader: this.props.classes.subheader
                    }}
                                title={I18n.t('js.user.home.private.title')}
                                subheader={I18n.t('js.user.home.private.subtitle')}
                                action={
                                    <IconButton className={this.props.classes.sortIcon}
                                                component={Link}
                                                aria-label="Show more"
                                                to={{
                                                    hash: '#' + sortTopicParam,
                                                    state: {
                                                        visibility: 'only_me'
                                                    }
                                                }}>
                                        <CompareArrowsIcon/>
                                    </IconButton>
                                }/>

                    <CardContent>
                        <Grid container={true}
                              spacing={4}
                              direction="row"
                              justify="flex-start"
                              alignItems="center">
                            {
                                this.props.privateTopics.map((topic) => (
                                    <Grid key={topic.id}
                                          className={this.props.classes.gridTheme}
                                          item={true}
                                          xs={12}
                                          sm={6}
                                          lg={4}>
                                        <Link to={{
                                            pathname: topicArticlesPath(this.props.user.slug, topic.slug)
                                        }}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={classNames(this.props.classes.topic, {
                                                [this.props.classes.storyTopic]: topic.mode === 'stories'
                                            })}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.topicTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>

                                                {
                                                    topic.mode !== 'default' &&
                                                    <div className={this.props.classes.topicMode}>
                                                        {I18n.t(`js.topic.enums.mode.${topic.mode}`)}
                                                    </div>
                                                }
                                            </Paper>
                                        </Link>

                                        <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                            <Fab className={classNames(this.props.classes.topicLink, {
                                                [this.props.classes.storyTopicLink]: topic.mode === 'stories'
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
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    hash: '#' + newTopicParam,
                                    state: {
                                        mode: 'default',
                                        visibility: 'only_me'
                                    }
                                }}>
                                    <Paper className={this.props.classes.topicNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.topicNewTitle}
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

                <Card component="section"
                      className={this.props.classes.card}
                      elevation={5}>
                    <CardHeader classes={{
                        root: this.props.classes.header,
                        subheader: this.props.classes.subheader
                    }}
                                title={I18n.t('js.user.home.public.title')}
                                subheader={I18n.t('js.user.home.public.subtitle')}
                                action={
                                    <IconButton className={this.props.classes.sortIcon}
                                                component={Link}
                                                to={{
                                                    hash: '#' + sortTopicParam,
                                                    state: {
                                                        visibility: 'everyone'
                                                    }
                                                }}>
                                        <CompareArrowsIcon/>
                                    </IconButton>
                                }/>

                    <CardContent>
                        <Grid container={true}
                              spacing={4}
                              direction="row"
                              justify="flex-start"
                              alignItems="center">
                            {
                                this.props.publicTopics.map((topic) => (
                                    <Grid key={topic.id}
                                          className={this.props.classes.gridTheme}
                                          item={true}
                                          xs={12}
                                          sm={6}
                                          lg={4}>
                                        <Link to={{
                                            pathname: topicArticlesPath(this.props.user.slug, topic.slug)
                                        }}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={this.props.classes.topic}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.topicTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>

                                                {
                                                    topic.mode !== 'default' &&
                                                    <div className={this.props.classes.topicMode}>
                                                        {I18n.t(`js.topic.enums.mode.${topic.mode}`)}
                                                    </div>
                                                }
                                            </Paper>
                                        </Link>

                                        <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                            <Fab className={this.props.classes.topicLink}
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
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    hash: '#' + newTopicParam,
                                    state: {
                                        mode: 'default',
                                        visibility: 'everyone'
                                    }
                                }}>
                                    <Paper className={this.props.classes.topicNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.topicNewTitle}
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

                {
                    this.props.contributedTopics.length > 0 &&
                    <>
                        <Divider/>

                        <Card component="section"
                              className={this.props.classes.card}
                              elevation={5}>
                            <CardHeader classes={{
                                root: this.props.classes.header,
                                subheader: this.props.classes.subheader
                            }}
                                        title={I18n.t('js.user.home.shared.title')}
                                        subheader={I18n.t('js.user.home.shared.subtitle')}/>

                            <CardContent>
                                <Grid container={true}
                                      spacing={4}
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="center">
                                    {
                                        this.props.contributedTopics.map((topic) => (
                                            <Grid key={topic.id}
                                                  className={this.props.classes.gridTheme}
                                                  item={true}
                                                  xs={12}
                                                  sm={6}
                                                  lg={4}>
                                                <Link to={{
                                                    pathname: topicArticlesPath(this.props.user.slug, topic.slug, 'shared-topics'),
                                                }}
                                                      onClick={this._handleTopicClick.bind(this, topic)}>
                                                    <Paper className={this.props.classes.topic}
                                                           elevation={1}>
                                                        <Typography className={this.props.classes.topicTitle}
                                                                    variant="h5"
                                                                    component="h2">
                                                            {topic.name}
                                                        </Typography>
                                                    </Paper>
                                                </Link>

                                                <Link to={userTopicPath(this.props.user.slug, topic.slug)}>
                                                    <Fab className={this.props.classes.topicLink}
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
                    </>
                }
            </div>
        );
    }
}
