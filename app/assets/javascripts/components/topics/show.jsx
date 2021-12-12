'use strict';

import '../../../stylesheets/pages/topic/show.scss';

import {
    hot
} from 'react-hot-loader/root';

import {
    Link
} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

import LabelIcon from '@material-ui/icons/Label';
import ShareIcon from '@material-ui/icons/Share';

import {
    taggedTopicArticlesPath,
    editTopicPath,
    shareTopicParam,
    topicArticlesPath
} from '../../constants/routesHelper';

import {
    fetchTopic,
    deleteTopic,
    spyTrackClick
} from '../../actions';

import UserAvatarIcon from '../users/icons/avatar';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    isFetching: state.topicState.isFetching,
    topic: state.topicState.topic,
    isOwner: state.userState.currentId === state.topicState.topic?.user?.id
}), {
    fetchTopic,
    deleteTopic
})
@hot
class TopicShow extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        initProps: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        isFetching: PropTypes.bool,
        topic: PropTypes.object,
        isOwner: PropTypes.bool,
        fetchTopic: PropTypes.func,
        deleteTopic: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {
            localTopic: this.props.initProps?.topic
        });
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug);
        }
    }

    _handleTagClick = (tag) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.userId, tag.name, null);
    };

    _handleTopicDelete = (event) => {
        event.preventDefault();

        this.props.deleteTopic(this.props.currentUserId, this.props.topic.id)
            .then(() => window.location = '/');
    };

    render() {
        if (!this.props.topic && !this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            );
        } else if (this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <article className="topic-show-root">
                <Typography className="topic-show-title"
                            component="h1"
                            variant="h1">
                    {I18n.t('js.topic.show.title', {name: this.props.topic.name})}
                </Typography>

                <div className="row">
                    <div className="col s12 center">
                        <Button color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={topicArticlesPath(this.props.topic.user.slug, this.props.topic.slug)}>
                            {I18n.t('js.topic.show.topic_articles', {name: this.props.topic.name})}
                        </Button>
                    </div>

                    <div className="col s12 l8">
                        <Typography className="topic-show-subtitle"
                                    component="h2"
                                    variant="h2">
                            {I18n.t('js.topic.model.description')}
                        </Typography>

                        <div className="margin-bottom-65">
                            {
                                this.props.topic.description
                                    ?
                                    <h2 className="topic-show-description"
                                        dangerouslySetInnerHTML={{__html: this.props.topic.description}}/>
                                    :
                                    <p className="topic-show-emptyDesc">
                                        {I18n.t('js.topic.common.no_description')}
                                    </p>
                            }
                        </div>

                        <div>
                            <Typography className="topic-show-subtitle"
                                        variant="h2"
                                        component="h3">
                                {I18n.t('js.topic.model.tags')}
                            </Typography>

                            {
                                this.props.topic.tags.map((tag) => (
                                    <Chip key={tag.id}
                                          className="topic-show-topicTag"
                                          icon={<LabelIcon/>}
                                          label={tag.name}
                                          color="primary"
                                          variant="outlined"
                                          component={Link}
                                          to={taggedTopicArticlesPath(this.props.topic.user.slug, this.props.topic.slug, tag.slug)}
                                          onClick={this._handleTagClick.bind(this, tag)}/>
                                ))
                            }
                        </div>
                    </div>

                    <div className="col s12 l4">
                        {
                            (this.props.isOwner && this.props.topic.visibility !== 'only_me') &&
                            <div>
                                <Typography className="topic-show-subtitle2"
                                            variant="h3"
                                            component="h3">
                                    {I18n.t('js.topic.model.contributors')}
                                </Typography>

                                {
                                    this.props.topic.contributors.map((contributor) => (
                                        <UserAvatarIcon key={contributor.id}
                                                        className="topic-show-avatar"
                                                        user={contributor}/>
                                    ))
                                }

                                <Button className="topic-show-shareButton"
                                        color="default"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={{
                                            hash: '#' + shareTopicParam,
                                            state: {
                                                topicId: this.props.topic.id
                                            }
                                        }}>
                                    {I18n.t('js.topic.show.share')}
                                    <ShareIcon className="topic-show-shareButtonIcon"/>
                                </Button>
                            </div>
                        }

                        <div>
                            <Typography className="topic-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.topic.model.articles_count')}
                            </Typography>

                            <p>
                                {I18n.t('js.topic.show.articles_count', {count: this.props.topic.articlesCount})}
                            </p>
                        </div>

                        <div>
                            <Typography className="topic-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.topic.model.languages')}
                            </Typography>

                            <p>
                                {this.props.topic.languages?.map((language) => I18n.t(`js.languages.${language}`)).join(', ')}
                            </p>
                        </div>

                        <div>
                            <Typography className="topic-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.topic.model.owner')}
                            </Typography>

                            <UserAvatarIcon className="topic-show-avatar"
                                            user={this.props.topic.user}/>
                        </div>

                        {
                            this.props.isOwner &&
                            <div>
                                <Typography className="topic-show-subtitle2"
                                            variant="h3"
                                            component="h3">
                                    {I18n.t('js.topic.model.visibility')}
                                </Typography>

                                <p>
                                    {this.props.topic.visibilityTranslated}
                                </p>
                            </div>
                        }
                    </div>
                </div>

                {
                    this.props.isOwner &&
                    <>
                        <div className="center-align margin-top-60 margin-bottom-20">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={editTopicPath(this.props.topic.user.slug, this.props.topic.slug)}>
                                {I18n.t('js.topic.show.edit_link')}
                            </Button>
                        </div>

                        <div className="center-align margin-top-40">
                            <Button className="topic-show-shareButton"
                                    color="default"
                                    variant="text"
                                    size="small"
                                    onClick={this._handleTopicDelete}>
                                {I18n.t('js.topic.edit.delete')}
                            </Button>
                        </div>
                    </>
                }
            </article>
        );
    }
}
