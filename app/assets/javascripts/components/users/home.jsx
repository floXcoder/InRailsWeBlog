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

import ShareIcon from '@material-ui/icons/Share';

import {
    spyTrackClick
} from '../../actions';

import {
    getUser,
    getPublicTopics,
    getPrivateTopics,
    getContributedTopics
} from '../../selectors';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import styles from '../../../jss/user/home';

export default @connect((state) => ({
    isFetching: state.userState.isFetching,
    user: getUser(state),
    publicTopics: getPublicTopics(state),
    privateTopics: getPrivateTopics(state),
    contributedTopics: getContributedTopics(state)
}))
@hot
@withStyles(styles)
class UserHome extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        user: PropTypes.object,
        publicTopics: PropTypes.array,
        privateTopics: PropTypes.array,
        contributedTopics: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleTopicClick = (topic) => {
        spyTrackClick('topic', topic.id, topic.slug)
    };

    _handleShareTopicClick = (topicId) => {

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
                        root: this.props.classes.header
                    }}
                                title={I18n.t('js.user.home.private.title')}
                                subheader={I18n.t('js.user.home.private.subtitle')}/>

                    <CardContent>
                        <Grid container={true}
                              spacing={32}
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
                                        <Link to={`/users/${this.props.user.slug}/topics/${topic.slug}`}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={classNames(this.props.classes.theme, {
                                                [this.props.classes.storyTheme]: topic.mode === 'stories'
                                            })}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.themeTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))
                            }

                            <Grid item={true}
                                  xs={12}
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    hash: '#new-topic',
                                    state: {
                                        mode: 'default',
                                        visibility: 'only_me'
                                    }
                                }}>
                                    <Paper className={this.props.classes.themeNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.themeNewTitle}
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
                        root: this.props.classes.header
                    }}
                                title={I18n.t('js.user.home.public.title')}
                                subheader={I18n.t('js.user.home.public.subtitle')}/>

                    <CardContent>
                        <Grid container={true}
                              spacing={32}
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
                                        <Link to={`/users/${this.props.user.slug}/topics/${topic.slug}`}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={this.props.classes.theme}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.themeTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>
                                            </Paper>
                                        </Link>

                                        <Link to={{
                                            hash: '#share-topic',
                                            state: {
                                                topicId: topic.id
                                            }
                                        }}>
                                            <Fab className={this.props.classes.shareButton}
                                                 variant="extended"
                                                 size="small"
                                                 color="primary"
                                                 aria-label="Share"
                                                 onClick={this._handleShareTopicClick.bind(this, topic.id)}>
                                                <ShareIcon/>
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
                                    hash: '#new-topic',
                                    state: {
                                        mode: 'default',
                                        visibility: 'everyone'
                                    }
                                }}>
                                    <Paper className={this.props.classes.themeNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.themeNewTitle}
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
                        <hr/>

                        <Card component="section"
                              className={this.props.classes.card}
                              elevation={5}>
                            <CardHeader classes={{
                                root: this.props.classes.header
                            }}
                                        title={I18n.t('js.user.home.shared.title')}
                                        subheader={I18n.t('js.user.home.shared.subtitle')}/>

                            <CardContent>
                                <Grid container={true}
                                      spacing={32}
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
                                                <Link to={`/users/${this.props.user.slug}/shared-topics/${topic.slug}`}
                                                      onClick={this._handleTopicClick.bind(this, topic)}>
                                                    <Paper className={this.props.classes.theme}
                                                           elevation={1}>
                                                        <Typography className={this.props.classes.themeTitle}
                                                                    variant="h5"
                                                                    component="h2">
                                                            {topic.name}
                                                        </Typography>
                                                    </Paper>
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
