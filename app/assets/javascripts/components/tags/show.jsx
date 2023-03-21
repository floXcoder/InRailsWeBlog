'use strict';

import '../../../stylesheets/pages/tag/show.scss';

import {
    Link
} from 'react-router-dom';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import LabelIcon from '@mui/icons-material/Label';

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

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import UserAvatarIcon from '../users/icons/avatar';


export default @connect((state) => ({
    currentUser: getCurrentUser(state),
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag
}), {
    fetchTag
})
@withRouter({params: true})
class TagShow extends React.Component {
    static propTypes = {
        initProps: PropTypes.object,
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        fetchTag: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._initRequest = false;
    }

    componentDidMount() {
        this._initRequest = true;

        this.props.fetchTag(this.props.routeParams.tagSlug, {}, {
            localTag: this.props.initProps?.tag
        });
    }

    componentDidUpdate(prevProps) {
        this._initRequest = false;

        if (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.tag.slug !== this.props.routeParams.tagSlug) {
            this.props.fetchTag(this.props.routeParams.tagSlug);
        }
    }

    render() {
        if (!this.props.tag && !this.props.isFetching && !this._initRequest) {
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
            <article className="tag-show-root">
                <Typography className="tag-show-title"
                            component="h1"
                            variant="h1">
                    {I18n.t('js.tag.show.title', {name: this.props.tag.name})}
                </Typography>

                <div className="row">
                    <div className="col s12 margin-top-40 center">
                        <Button color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={taggedArticlesPath(this.props.tag.slug)}>
                            {I18n.t('js.tag.show.tagged_articles', {name: this.props.tag.name})}
                        </Button>
                    </div>

                    <div className="col s12 l8">
                        <Typography className="tag-show-subtitle"
                                        variant="h2"
                                        component="h3">
                                {I18n.t('js.tag.model.description')}
                        </Typography>

                            {
                                this.props.tag.description
                                    ?
                                    <h2 className="tag-show-description"
                                        dangerouslySetInnerHTML={{__html: this.props.tag.description}}/>
                                    :
                                    <p>
                                        <em>{I18n.t('js.tag.common.no_description')}</em>
                                    </p>
                            }

                        {
                            this.props.tag.parents.length > 0 &&
                            <div className="margin-bottom-20">
                                <Typography className="tag-show-subtitle"
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
                                                      root: 'tag-show-tag-chip',
                                                      label: 'tag-show-tag-label'
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
                                <Typography className="tag-show-subtitle"
                                            variant="h2"
                                            component="h3">
                                    {I18n.t('js.tag.model.children')}
                                </Typography>

                                {
                                    this.props.tag.children.map((tag) => (
                                        <Chip key={tag.id}
                                              component={Link}
                                              classes={{
                                                  root: 'tag-show-tag-chip',
                                                  label: 'tag-show-tag-label'
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
                            <Typography className="tag-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.articles_count')}
                            </Typography>

                            <p>
                                {I18n.t('js.tag.show.articles_count', {count: this.props.tag.taggedArticlesCount})}
                            </p>
                        </div>

                        <div>
                            <Typography className="tag-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.visibility')}
                            </Typography>

                            <p>
                                {this.props.tag.visibilityTranslated}
                            </p>
                        </div>

                        <div>
                            <Typography className="tag-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.synonyms')}
                            </Typography>

                            {
                                Utils.isPresent(this.props.tag.synonyms)
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
                            <Typography className="tag-show-subtitle2"
                                        variant="h3"
                                        component="h3">
                                {I18n.t('js.tag.model.owner')}
                            </Typography>

                            <UserAvatarIcon className="tag-show-avatar"
                                            user={this.props.tag.user}/>
                        </div>

                        {
                            !!(this.props.currentUser?.id === this.props.tag.user.id && this.props.tag.visibility === 'everyone' && this.props.tag.tracker) &&
                            <div>
                                <Typography className="tag-show-subtitle2"
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
                        <Button
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
