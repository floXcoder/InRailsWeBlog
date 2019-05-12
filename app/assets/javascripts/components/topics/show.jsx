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
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

import LabelIcon from '@material-ui/icons/Label';
import ShareIcon from '@material-ui/icons/Share';

import {
    fetchTopic,
    spyTrackClick
} from '../../actions';

import {
    getTopicMetaTags
} from '../../selectors';

import UserAvatarIcon from '../users/icons/avatar';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotFound from '../layouts/notFound';

import styles from '../../../jss/topic/show';

export default @connect((state) => ({
    metaTags: getTopicMetaTags(state),
    isFetching: state.topicState.isFetching,
    topic: state.topicState.topic
}), {
    fetchTopic
})
@hot
@withStyles(styles)
class TopicShow extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from connect
        metaTags: PropTypes.object,
        isFetching: PropTypes.bool,
        topic: PropTypes.object,
        fetchTopic: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug);
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug);
        }
    }

    _handleTagClick = (tag) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.name);
    };

    render() {
        if (!this.props.topic) {
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
            <article className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                <Typography className={this.props.classes.title}
                            component="h1"
                            variant="h1">
                    {this.props.topic.name}
                </Typography>


                <div className="row">
                    <div className="col s12 l7">
                        <div>
                            <Typography className={this.props.classes.subtitle}
                                        component="h2"
                                        variant="h2">
                                {I18n.t('js.topic.model.description')}
                            </Typography>

                            {
                                this.props.topic.description ||
                                <p className="">
                                    {I18n.t('js.topic.common.no_description')}
                                </p>
                            }
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle}
                                        component="h2"
                                        variant="h2">
                                {I18n.t('js.topic.model.tags')}
                            </Typography>

                            {
                                this.props.topic.tags.map((tag) => (
                                    <Chip key={tag.id}
                                          className={this.props.classes.topicTag}
                                          icon={<LabelIcon/>}
                                          label={tag.name}
                                          color="primary"
                                          variant="outlined"
                                          component={Link}
                                          to={`/users/${this.props.topic.user.slug}/topics/${this.props.topic.slug}/tagged/${tag.slug}`}
                                          onClick={this._handleTagClick.bind(this, tag)}/>
                                ))
                            }
                        </div>
                    </div>

                    <div className="col s12 l5">
                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.topic.model.owner')}
                            </Typography>

                            <UserAvatarIcon className={this.props.classes.avatar}
                                            user={this.props.topic.user}/>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.topic.model.contributors')}
                            </Typography>

                            {
                                this.props.topic.contributors.map((contributor) => (
                                    <UserAvatarIcon key={contributor.id}
                                                    className={this.props.classes.avatar}
                                                    user={contributor}/>
                                ))
                            }

                            <Button className={this.props.classes.shareButton}
                                    color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={{
                                        hash: '#share-topic',
                                        state: {
                                            topicId: this.props.topic.id
                                        }
                                    }}>
                                Partager ce topic
                                <ShareIcon className={this.props.classes.shareButtonIcon}/>
                            </Button>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.topic.model.articles_count')}
                            </Typography>

                            <p>
                                {this.props.topic.articlesCount}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.topic.model.visibility')}
                            </Typography>

                            <p>
                                {this.props.topic.visibilityTranslated}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.topic.common.stats.title')}
                            </Typography>

                            <p>
                                {I18n.t('js.topic.common.stats.views')}
                                {this.props.topic.viewsCount}
                            </p>
                            <p>
                                {I18n.t('js.topic.common.stats.clicks')}
                                {this.props.topic.clicksCount}
                            </p>
                            <p>
                                {I18n.t('js.topic.common.stats.searches')}
                                {this.props.topic.searchesCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="margin-top-40 margin-bottom-20">
                    <div className="row">
                        <div className="col s6 center-align">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={'/'}>
                                {I18n.t('js.topic.show.back_button')}
                            </Button>
                        </div>

                        <div className="col s6 center-align">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={`/users/${this.props.topic.user.slug}/topics/${this.props.topic.slug}/edit`}>
                                {I18n.t('js.topic.show.edit_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
