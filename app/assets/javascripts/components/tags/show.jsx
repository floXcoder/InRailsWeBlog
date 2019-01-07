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

import {
    fetchTag,
    spyTrackClick
} from '../../actions';

import {
    getTagMetaTags
} from '../../selectors';

import UserAvatarIcon from '../users/icons/avatar';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotFound from '../layouts/notFound';

import styles from '../../../jss/tag/show';

export default @hot(module)

@connect((state) => ({
    metaTags: getTagMetaTags(state),
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag
}), {
    fetchTag
})
@withStyles(styles)
class TagShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // from connect
        metaTags: PropTypes.object,
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
        this.props.fetchTag(this.props.params.tagSlug);
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.params, prevProps.params)) {
            this.props.fetchTag(this.props.params.tagSlug);
        }
    }

    render() {
        if (!this.props.tag) {
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
                    {this.props.tag.name}
                </Typography>


                <div className="row">
                    <div className="col s12 l7">
                        <div>
                            <Typography className={this.props.classes.subtitle}
                                        component="h2"
                                        variant="h2">
                                {I18n.t('js.tag.model.description')}
                            </Typography>

                            {
                                this.props.tag.description
                                    ?
                                    this.props.tag.description
                                    :
                                    <p className="">
                                        {I18n.t('js.tag.common.no_description')}
                                    </p>
                            }
                        </div>

                        <div className="margin-bottom-20">
                            <Typography className={this.props.classes.subtitle}
                                        component="h2"
                                        variant="h2">
                                {I18n.t('js.tag.model.parents')}
                            </Typography>

                            {
                                this.props.tag.parents.size > 0
                                    ?
                                    <div className="tag-parents">
                                        {
                                            this.props.tag.parents.map((tag) => (
                                                <Link key={tag.id}
                                                      to={`/tags/${tag.slug}`}
                                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                    {tag.name}
                                                </Link>
                                            ))
                                        }
                                    </div>
                                    :
                                    <p className="">
                                        {I18n.t('js.tag.common.no_parents')}
                                    </p>
                            }
                        </div>

                        <div className="margin-bottom-20">
                            <Typography className={this.props.classes.subtitle}
                                        component="h2"
                                        variant="h2">
                                {I18n.t('js.tag.model.children')}
                            </Typography>

                            {
                                this.props.tag.children.size > 0
                                    ?
                                    <div>
                                        {
                                            this.props.tag.children.map((tag) => (
                                                <Link key={tag.id}
                                                      to={`/tags/${tag.slug}`}
                                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                    {tag.name}
                                                </Link>
                                            ))
                                        }
                                    </div>
                                    :
                                    <span>
                                        {I18n.t('js.tag.common.no_children')}
                                    </span>
                            }
                        </div>
                    </div>

                    <div className="col s12 l5">
                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.tag.model.owner')}
                            </Typography>

                            <UserAvatarIcon className={this.props.classes.avatar}
                                            user={this.props.tag.user}/>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.tag.model.articles_count')}
                            </Typography>

                            <p>
                                {this.props.tag.taggedArticlesCount}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.tag.model.visibility')}
                            </Typography>

                            <p>
                                {this.props.tag.visibilityTranslated}
                            </p>
                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
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
                                        {I18n.t('js.tag.common.no_synonyms')}
                                    </p>
                            }

                        </div>

                        <div>
                            <Typography className={this.props.classes.subtitle2}
                                        component="h3"
                                        variant="h3">
                                {I18n.t('js.tag.common.stats.title')}
                            </Typography>

                            <p>
                                {I18n.t('js.tag.common.stats.views')}
                                {this.props.tag.viewsCount}
                            </p>
                            <p>
                                {I18n.t('js.tag.common.stats.clicks')}
                                {this.props.tag.clicksCount}
                            </p>
                            <p>
                                {I18n.t('js.tag.common.stats.searches')}
                                {this.props.tag.searchesCount}
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
                                {I18n.t('js.tag.show.back_button')}
                            </Button>
                        </div>

                        <div className="col s6 center-align">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={`/tags/${this.props.tag.slug}/edit`}>
                                {I18n.t('js.tag.show.edit_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
