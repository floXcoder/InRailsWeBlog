'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import EditIcon from '@material-ui/icons/Edit';
import LabelIcon from '@material-ui/icons/Label';

import {
    fetchTags,
    spyTrackClick
} from '../../actions';

import {
    getTagMetaTags,
    getPublicTags,
    getPrivateTags
} from '../../selectors';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';

import styles from '../../../jss/tag/index';

export default @hot(module)

@connect((state) => ({
    metaTags: getTagMetaTags(state),
    isUserConnected: state.userState.isConnected,
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    isFetching: state.tagState.isFetching,
    publicTags: getPublicTags(state),
    privateTags: getPrivateTags(state)
}), {
    fetchTags
})
@withStyles(styles)
class TagIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // from connect
        metaTags: PropTypes.object,
        isUserConnected: PropTypes.bool,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        publicTags: PropTypes.array,
        privateTags: PropTypes.array,
        fetchTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.params.userSlug) {
            this.props.fetchTags({
                userSlug: this.props.params.userSlug
            }, {
                limit: 1000
            });
        } else if (this.props.params.topicSlug) {
            this.props.fetchTags({
                topicSlug: this.props.params.topicSlug
            }, {
                limit: 1000
            });
        } else {
            this.props.fetchTags({
                visibility: 'everyone'
            }, {
                limit: 1000
            });
        }
    }

    _renderTitle = () => {
        if (this.props.params.userSlug) {
            return I18n.t('js.tag.index.titles.user');
        } else if (this.props.params.topicSlug && this.props.currentTopic) {
            return I18n.t('js.tag.index.titles.topic', {topic: this.props.currentTopic.name});
        } else {
            return I18n.t('js.tag.index.titles.all');
        }
    };

    _renderTagItem = (tag) => {
        return (
            <div key={tag.id}
                 className={classNames('col s12', {
                     'm4': !this.props.isUserConnected
                 })}>
                <Card className={this.props.classes.tagCard}>
                    <CardHeader classes={{
                        root: this.props.classes.tagHeader
                    }}
                                title={
                                    <Link className={this.props.classes.tagTitle}
                                          to={`/tags/${tag.slug}`}
                                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                        {tag.name}
                                    </Link>
                                }
                                subheader={tag.synonyms.join(', ')}
                                action={
                                    <span className={this.props.classes.tagCount}>{tag.taggedArticlesCount}</span>
                                }
                    />

                    {
                        tag.description &&
                        <CardContent classes={{
                            root: this.props.classes.tagHeader
                        }}>
                            <Typography component="p">
                                {tag.description}
                            </Typography>
                        </CardContent>
                    }

                    <CardActions className={this.props.classes.actions}
                                 disableActionSpacing={true}>
                        <div className={this.props.classes.buttonsRight}>
                            <IconButton aria-label="Edit"
                                        component={Link}
                                        className={this.props.classes.tagButton}
                                        to={`/tags/${tag.slug}/edit`}>
                                <EditIcon/>
                            </IconButton>

                            <IconButton aria-label="Show"
                                        component={Link}
                                        className={this.props.classes.tagButton}
                                        to={`/tags/${tag.slug}`}
                                        onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                <LabelIcon/>
                            </IconButton>
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                {
                    this.props.isFetching &&
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                }

                <div className="margin-bottom-20">
                    <Typography className={this.props.classes.title}
                                component="h1"
                                variant="h1">
                        {this._renderTitle()}
                    </Typography>

                    {
                        (!Utils.isEmpty(this.props.params) && this.props.currentUser) &&
                        <div className="center-align margin-top-20">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={`/tags/${this.props.currentUser.slug}/sort`}>
                                {I18n.t('js.tag.index.sort')}
                            </Button>
                        </div>
                    }
                </div>

                <div className="row">
                    <div className={classNames('col s12', {
                        'm6': this.props.isUserConnected
                    })}>
                        <Typography className={this.props.classes.subtitle}
                                    component="h2"
                                    variant="h2">
                            {I18n.t('js.tag.common.publics')}
                        </Typography>

                        {
                            this.props.publicTags.length > 0
                                ?
                                <div className="row">
                                    {
                                        this.props.publicTags.map(this._renderTagItem)
                                    }
                                </div>
                                :
                                <Typography variant="body1">
                                    {I18n.t('js.tag.common.no_publics')}
                                </Typography>
                        }
                    </div>

                    <div className="col s12 m6">
                        {
                            (!Utils.isEmpty(this.props.params)) &&
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
                                            {I18n.t('js.tag.common.no_privates')}
                                        </Typography>
                                }
                            </div>
                        }
                    </div>
                </div>

                {
                    this.props.currentUser &&
                    <div className="margin-top-40 margin-bottom-20">
                        <div className="row">
                            <div className="col s6 center-align">
                                <Button color="default"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/tags/${this.props.currentUser.slug}`}>
                                    {I18n.t('js.tag.index.links.user_tags')}
                                </Button>
                            </div>

                            <div className="col s6 center-align">
                                <Button color="default"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={'/tags'}>
                                    {I18n.t('js.tag.index.links.all_tags')}
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
