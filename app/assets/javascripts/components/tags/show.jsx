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
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import LabelIcon from '@material-ui/icons/Label';

import {
    taggedArticlesPath,
    showTagPath,
    editTagPath
} from '../../constants/routesHelper';

import {
    fetchTag,
    spyTrackClick
} from '../../actions';

import {
    getCurrentUser
} from '../../selectors';

import UserAvatarIcon from '../users/icons/avatar';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import styles from '../../../jss/tag/show';


export default @connect((state) => ({
    currentUser: getCurrentUser(state),
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag
}), {
    fetchTag
})
@hot
@withStyles(styles)
class TagShow extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        initProps: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        fetchTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTag(this.props.routeParams.tagSlug, {
            localTag: this.props.initProps?.tag
        });
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this.props.fetchTag(this.props.routeParams.tagSlug);
        }
    }

    render() {
        if (!this.props.tag && !this.props.isFetching) {
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
            <article className={this.props.classes.root}>
                <Typography className={this.props.classes.title}
                            component="h1"
                            variant="h1">
                    {I18n.t('js.tag.show.title', {name: this.props.tag.name})}
                </Typography>

                <div className="row">
                    <div className="col s12 margin-top-30 center">
                        <Button color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={taggedArticlesPath(this.props.tag.slug)}>
                            {I18n.t('js.tag.show.tagged_articles', {name: this.props.tag.name})}
                        </Button>
                    </div>

                    <div className="col s12 l8">
                        <>
                            <Typography className={this.props.classes.subtitle}
                                        variant="h2"
                                        component="h3">
                                {I18n.t('js.tag.model.description')}
                            </Typography>

                            {
                                this.props.tag.description
                                    ?
                                    <h2 className={this.props.classes.description}
                                        dangerouslySetInnerHTML={{__html: this.props.tag.description}}/>
                                    :
                                    <p>
                                        <em>{I18n.t('js.tag.common.no_description')}</em>
                                    </p>
                            }
                        </>

                        {
                            this.props.tag.parents.length > 0 &&
                            <div className="margin-bottom-20">
                                <Typography className={this.props.classes.subtitle}
                                            variant="h2"
                                            component="h3">
                                    {I18n.t('js.tag.model.parents')}
                                </Typography>

                                <div className="tag-parents">
                                    {
                                        this.props.tag.parents.map((tag) => (
                                            <Chip key={tag.id}
                                                  component={Link}
                                                  classes={{
                                                      root: this.props.classes.tagChip,
                                                      label: this.props.classes.tagLabel
                                                  }}
                                                  to={showTagPath(tag.slug)}
                                                  label={tag.name}
                                                  variant="outlined"
                                                  icon={<LabelIcon/>}
                                                  clickable={true}
                                                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}/>
                                        ))
                                    }
                                </div>
                            </div>
                            // <p>
                            //     <em>{I18n.t('js.tag.common.no_parents')}</em>
                            // </p>
                        }

                        {
                            this.props.tag.children.length > 0 &&
                            <div className="margin-bottom-20">
                                <Typography className={this.props.classes.subtitle}
                                            variant="h2"
                                            component="h3">
                                    {I18n.t('js.tag.model.children')}
                                </Typography>

                                {
                                    this.props.tag.children.map((tag) => (
                                        <Chip key={tag.id}
                                              component={Link}
                                              classes={{
                                                  root: this.props.classes.tagChip,
                                                  label: this.props.classes.tagLabel
                                              }}
                                              to={showTagPath(tag.slug)}
                                              label={tag.name}
                                              variant="outlined"
                                              icon={<LabelIcon/>}
                                              clickable={true}
                                              onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}/>
                                    ))
                                }
                            </div>
                            // <span>
                            //     <em>{I18n.t('js.tag.common.no_children')}</em>
                            // </span>
                        }
                    </div>

                    <div className="col s12 l4">
                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.articles_count')}
                            </Typography>

                            <p>
                                {I18n.t('js.tag.show.articles_count', {count: this.props.tag.taggedArticlesCount})}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.visibility')}
                            </Typography>

                            <p>
                                {this.props.tag.visibilityTranslated}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.synonyms')}
                            </Typography>

                            {
                                !Utils.isEmpty(this.props.tag.synonyms)
                                    ?
                                    <p>
                                        {this.props.tag.synonyms.join(', ')}
                                    </p>
                                    :
                                    <p>
                                        <em>{I18n.t('js.tag.common.no_synonyms')}</em>
                                    </p>
                            }
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.owner')}
                            </Typography>

                            <UserAvatarIcon className={this.props.classes.avatar}
                                            user={this.props.tag.user}/>
                        </div>

                        {
                            (this.props.currentUser?.id === this.props.tag.user.id && this.props.tag.visibility === 'everyone' && this.props.tag.tracker) &&
                            <div>
                                <Typography className={this.props.classes.subtitle2}
                                            variant="h3"
                                            component="h3">
                                    {I18n.t('js.tag.common.stats.title')}
                                </Typography>

                                <p>
                                    {I18n.t('js.tag.common.stats.views')}
                                    {this.props.tag.tracker.viewsCount}
                                </p>
                                <p>
                                    {I18n.t('js.tag.common.stats.clicks')}
                                    {this.props.tag.tracker.clicksCount}
                                </p>
                                <p>
                                    {I18n.t('js.tag.common.stats.searches')}
                                    {this.props.tag.tracker.searchesCount}
                                </p>
                            </div>
                        }
                    </div>
                </div>

                {
                    this.props.currentUser?.id === this.props.tag.user.id &&
                    <div className="center-align margin-top-60 margin-bottom-20">
                        <Button color="default"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={editTagPath(this.props.tag.slug)}>
                            {I18n.t('js.tag.show.edit_link')}
                        </Button>
                    </div>
                }
            </article>
        );
    }
}
