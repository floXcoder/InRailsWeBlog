'use strict';

import '../../../stylesheets/pages/tag/index.scss';

import {
    Link
} from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';

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

import withRouter from '../modules/router';

import NotFound from '../layouts/notFound';


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
@withRouter({params: true})
class TagIndex extends React.Component {
    static propTypes = {
        initProps: PropTypes.object,
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        topic: PropTypes.object,
        publicTags: PropTypes.array,
        privateTags: PropTypes.array,
        fetchTags: PropTypes.func,
        fetchTopic: PropTypes.func
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
                  size={{xs: 12, md: 4}}>
                <Card className="tag-index-tag-card">
                    <CardHeader classes={{
                        root: 'tag-index-tag-header'
                    }}
                                title={
                                    <h3 className="tag-index-tag-title">
                                        {tag.name}
                                    </h3>
                                }
                                subheader={tag.synonyms.join(', ')}/>

                    {
                        !!tag.description &&
                        <CardContent classes={{
                            root: 'tag-index-tag-header'
                        }}>
                            <Typography component="div">
                                <div className="normalized-content"
                                     dangerouslySetInnerHTML={{__html: tag.description}}/>
                            </Typography>
                        </CardContent>
                    }

                    <CardActions className="tag-index-actions"
                                 disableSpacing={true}>
                        <Typography className="tag-index-tag-count"
                                    color="textSecondary">
                            {I18n.t('js.tag.index.article_count', {count: tag.taggedArticlesCount})}
                        </Typography>

                        <div>
                            <Button
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
            </Grid>
        );
    };

    render() {
        if (this.props.initProps?.status === '404') {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            );
        }

        if (this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (!this.props.publicTags?.length && !this.props.privateTags?.length) {
            return (
                <div className="row margin-top-30">
                    <div className="col m8 offset-m2 s10 offset-s1">
                        <Paper style={{
                            padding: '.6rem'
                        }}
                               elevation={4}>
                            <h1 className="center-align"
                                style={{
                                    fontSize: '1.8rem',
                                    marginTop: '1rem'
                                }}>
                                {I18n.t('js.tag.common.no_tags')}
                            </h1>
                        </Paper>
                    </div>
                </div>
            );
        }

        return (
            <div className="tag-index-root">
                <div className="margin-top-30 margin-bottom-20">
                    <Typography className="tag-index-title"
                                component="h1"
                                variant="h1">
                        {this._renderTitle()}
                    </Typography>

                    {
                        !!(Utils.isPresent(this.props.routeParams) && this.props.currentUser) &&
                        <div className="center-align margin-top-30">
                            <Button
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
                    !!this.props.topic?.description &&
                    <div className="margin-top-30 margin-bottom-20">
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.topic.description}}/>

                        <div className="margin-top-40 center-align">
                            <Button
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
                        <Typography className="tag-index-subtitle"
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
                                      justifyContent="space-between"
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
                            (Utils.isPresent(this.props.routeParams)) &&
                            <div className="margin-bottom-20">
                                <Typography className="tag-index-subtitle"
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
