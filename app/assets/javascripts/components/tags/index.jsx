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
// import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';

// import EditIcon from '@material-ui/icons/Edit';
// import LabelIcon from '@material-ui/icons/Label';

import {
    tagsPath,
    showTagPath,
    // editTagPath,
    sortTagPath
} from '../../constants/routesHelper';

import {
    fetchTags,
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
    isUserConnected: state.userState.isConnected,
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    isFetching: state.tagState.isFetching,
    publicTags: getPublicTags(state),
    privateTags: getPrivateTags(state)
}), {
    fetchTags
})
@hot
@withStyles(styles)
class TagIndex extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from connect
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
    }

    _renderTitle = () => {
        if (this.props.routeParams.topicSlug && this.props.currentTopic) {
            return I18n.t('js.tag.index.titles.topic', {topic: this.props.currentTopic.name});
        } else if (this.props.routeParams.userSlug) {
            return I18n.t('js.tag.index.titles.user');
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
                <Link to={showTagPath(tag.slug)}
                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}>
                    <Card className={this.props.classes.tagCard}>
                        <CardHeader classes={{
                            root: this.props.classes.tagHeader
                        }}
                                    title={
                                        <span className={this.props.classes.tagTitle}>
                                            {tag.name}
                                        </span>
                                    }
                                    subheader={tag.synonyms.join(', ')}
                                    action={
                                        <span className={this.props.classes.tagCount}>
                                            {tag.taggedArticlesCount}
                                        </span>
                                    }/>

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

                        {/*<CardActions className={this.props.classes.actions}*/}
                        {/*             disableSpacing={true}>*/}
                        {/*    <div className={this.props.classes.buttonsRight}>*/}
                        {/*        <IconButton aria-label="Edit"*/}
                        {/*                    component={Link}*/}
                        {/*                    className={this.props.classes.tagButton}*/}
                        {/*                    to={editTagPath(tag.slug)}>*/}
                        {/*            <EditIcon/>*/}
                        {/*        </IconButton>*/}

                        {/*        <IconButton aria-label="Show"*/}
                        {/*                    component={Link}*/}
                        {/*                    className={this.props.classes.tagButton}*/}
                        {/*                    to={showTagPath(tag.slug)}*/}
                        {/*                    onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name)}>*/}
                        {/*            <LabelIcon/>*/}
                        {/*        </IconButton>*/}
                        {/*    </div>*/}
                        {/*</CardActions>*/}
                    </Card>
                </Link>
            </div>
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
                <div className="margin-bottom-20">
                    <Typography className={this.props.classes.title}
                                component="h1"
                                variant="h1">
                        {this._renderTitle()}
                    </Typography>

                    {
                        (!Utils.isEmpty(this.props.routeParams) && this.props.currentUser) &&
                        <div className="center-align margin-top-20">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={sortTagPath(this.props.currentUser.slug)}>
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
                                        to={showTagPath(this.props.currentUser.slug)}>
                                    {I18n.t('js.tag.index.links.user_tags')}
                                </Button>
                            </div>

                            <div className="col s6 center-align">
                                <Button color="default"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={tagsPath()}>
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
