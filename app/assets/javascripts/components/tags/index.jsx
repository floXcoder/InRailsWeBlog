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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';

import {
    showTagPath,
    userTopicPath,
    // editTagPath,
    sortTagPath
} from '../../constants/routesHelper';

import {
    fetchTags,
    fetchTopic,
    spyTrackClick
} from '../../actions';

import {
    getPublicTags,
    getPrivateTags
} from '../../selectors';

import {
    tagSidebarLimit
} from '../modules/constants';

import Loader from '../theme/loader';

import styles from '../../../jss/tag/index';


export default @connect((state) => ({
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    topic: state.topicState.topic,
    isFetching: state.tagState.isFetching,
    publicTags: getPublicTags(state),
    privateTags: getPrivateTags(state)
}), {
    fetchTags,
    fetchTopic
})
@hot
@withStyles(styles)
class TagIndex extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        topic: PropTypes.object,
        publicTags: PropTypes.array,
        privateTags: PropTypes.array,
        fetchTags: PropTypes.func,
        fetchTopic: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.routeParams.topicSlug) {
            this.props.fetchTags({
                topicSlug: this.props.routeParams.topicSlug
            }, {
                userId: this.props.routeParams.userSlug,
                limit: tagSidebarLimit
            });
        } else if (this.props.routeParams.userSlug) {
            this.props.fetchTags({
                userSlug: this.props.routeParams.userSlug
            }, {
                limit: tagSidebarLimit
            });
        } else {
            this.props.fetchTags({
                visibility: 'everyone'
            }, {
                limit: tagSidebarLimit
            });
        }

        if (this.props.routeParams.topicSlug && this.props.routeParams.userSlug) {
            this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {no_meta: true});
        }
    }

    _renderTitle = () => {
        if (this.props.routeParams.topicSlug) {
            return I18n.t('js.tag.index.titles.topic', {topic: this.props.currentTopic?.name || this.props.topic?.name});
        } else if (this.props.routeParams.userSlug) {
            return I18n.t('js.tag.index.titles.user');
        } else {
            return I18n.t('js.tag.index.titles.all', {website: window.settings.website_name});
        }
    };

    _renderTagItem = (tag) => {
        return (
            <Grid key={tag.id}
                  item={true}
                  xs={12}
                  md={4}>
                <Link to={showTagPath(tag.slug)}
                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}>
                    <Card className={this.props.classes.tagCard}>
                        <CardHeader classes={{
                            root: this.props.classes.tagHeader
                        }}
                                    title={
                                        <h3 className={this.props.classes.tagTitle}>
                                            {tag.name}
                                        </h3>
                                    }
                                    subheader={tag.synonyms.join(', ')}/>

                        {
                            tag.description &&
                            <CardContent classes={{
                                root: this.props.classes.tagHeader
                            }}>
                                <Typography component="p">
                                    <div className="normalized-content"
                                         dangerouslySetInnerHTML={{__html: tag.description}}/>
                                </Typography>
                            </CardContent>
                        }

                        <CardActions className={this.props.classes.actions}
                                     disableSpacing={true}>
                            <Typography className={this.props.classes.tagCount}
                                        color="textSecondary">
                                {I18n.t('js.tag.index.article_count', {count: tag.taggedArticlesCount})}
                            </Typography>

                            <div>
                                <Button color="default"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={showTagPath(tag.slug)}
                                        onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}>
                                    {I18n.t('js.tag.index.show')}
                                </Button>
                            </div>
                        </CardActions>
                    </Card>
                </Link>
            </Grid>
        );
    };

    render() {
        if (this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div className={this.props.classes.root}>
                <div className="margin-top-30 margin-bottom-20">
                    <Typography className={this.props.classes.title}
                                component="h1"
                                variant="h1">
                        {this._renderTitle()}
                    </Typography>

                    {
                        (!Utils.isEmpty(this.props.routeParams) && this.props.currentUser) &&
                        <div className="center-align margin-top-30">
                            <Button color="default"
                                    variant="text"
                                    size="small"
                                    component={Link}
                                    to={sortTagPath(this.props.currentUser.slug)}>
                                {I18n.t('js.tag.index.sort')}
                            </Button>
                        </div>
                    }
                </div>

                {
                    this.props.topic?.description &&
                    <div className="margin-top-30 margin-bottom-20">
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.topic.description}}/>

                        <div className="margin-top-40 center-align">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={userTopicPath(this.props.topic.user.slug, this.props.topic.slug)}>
                                {I18n.t('js.tag.index.links.parent_topic', {topic: this.props.topic.name})}
                            </Button>
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col s12">
                        <Typography className={this.props.classes.subtitle}
                                    component="h2"
                                    variant="h2">
                            {I18n.t('js.tag.common.publics')}
                        </Typography>

                        {
                            this.props.publicTags.length > 0
                                ?
                                <Grid container={true}
                                      spacing={1}
                                      direction="row"
                                      justify="space-between"
                                      alignItems="flex-start">
                                    {
                                        this.props.publicTags.map(this._renderTagItem)
                                    }
                                </Grid>
                                :
                                <Typography variant="body1">
                                    <em>{I18n.t('js.tag.common.no_publics')}</em>
                                </Typography>
                        }
                    </div>

                    <div className="col s12">
                        {
                            (!Utils.isEmpty(this.props.routeParams)) &&
                            <div className="margin-bottom-20">
                                <Typography className={this.props.classes.subtitle}
                                            component="h2"
                                            variant="h2">
                                    {I18n.t('js.tag.common.privates')}
                                </Typography>

                                {
                                    this.props.privateTags.length > 0
                                        ?
                                        <div className="row tag-privates">
                                            {
                                                this.props.privateTags.map(this._renderTagItem)
                                            }
                                        </div>
                                        :
                                        <Typography variant="body1">
                                            <em>{I18n.t('js.tag.common.no_privates')}</em>
                                        </Typography>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
