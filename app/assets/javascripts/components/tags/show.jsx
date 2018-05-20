'use strict';

import {
    Link
} from 'react-router-dom';

import {
    fetchTag,
    deleteTag,
    spyTrackClick
} from '../../actions';

import {
    getTagIsOwner
} from '../../selectors';

import UserAvatarIcon from '../users/icons/avatar';

import Loader from '../theme/loader';

@connect((state) => ({
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag,
    isOwner: getTagIsOwner(state, state.tagState.tag),
    isUserConnected: state.userState.isConnected
}), {
    fetchTag,
    deleteTag
})
export default class TagShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        isOwner: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        fetchTag: PropTypes.func,
        deleteTag: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTag(this.props.params.tagSlug);
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.params, prevProps.params)) {
            this.props.fetchTag(prevProps.params.tagSlug);
        }
    }

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this.props.deleteTag(this.props.tag.id)
            .then(() => this.props.history.push({
                    pathname: `/`,
                    state: {reloadTags: true}
                })
            );

    };

    render() {
        if (!this.props.tag) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            )
        }

        return (
            <article className="card blog-tag">
                <div className="card-content">
                    <h1 className="tag-title">
                        {this.props.tag.name}
                    </h1>

                    <div className="row">
                        <div className="col s12 l8">
                            <div className="tag-description">
                                <h2 className="tag-subtitle">
                                    {I18n.t('js.tag.model.description')}
                                </h2>

                                {
                                    this.props.tag.description
                                        ?
                                        this.props.tag.description
                                        :
                                        <span className="tag-no-description">
                                            {I18n.t('js.tag.common.no_description')}
                                        </span>
                                }
                            </div>

                            <div className="margin-bottom-20">
                                <h2 className="tag-subtitle">
                                    {I18n.t('js.tag.model.parents')}
                                </h2>

                                {
                                    this.props.tag.parents.size > 0
                                        ?
                                        <div className="tag-parents">
                                            {
                                                this.props.tag.parents.map((tag) => (
                                                    <Link key={tag.id}
                                                          className="tag-default tag-parent"
                                                          to={`/tag/${tag.slug}`}
                                                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                        {tag.name}
                                                    </Link>
                                                ))
                                            }
                                        </div>
                                        :
                                        <span className="tag-no-parents">
                                            {I18n.t('js.tag.common.no_parents')}
                                        </span>
                                }
                            </div>

                            <div className="margin-bottom-20">
                                <h2 className="tag-subtitle">
                                    {I18n.t('js.tag.model.children')}
                                </h2>

                                {
                                    this.props.tag.children.size > 0
                                        ?
                                        <div className="tag-children">
                                            {
                                                this.props.tag.children.map((tag) => (
                                                    <Link key={tag.id}
                                                          className="tag-default tag-child"
                                                          to={`/tag/${tag.slug}`}
                                                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                        {tag.name}
                                                    </Link>
                                                ))
                                            }
                                        </div>
                                        :
                                        <span className="tag-no-children">
                                            {I18n.t('js.tag.common.no_children')}
                                        </span>
                                }
                            </div>
                        </div>

                        <div className="col s12 l4">
                            <div className="tag-category">
                                <h3 className="tag-category-title">
                                    {I18n.t('js.tag.model.owner')}
                                </h3>

                                <UserAvatarIcon user={this.props.tag.user}
                                                className="tag-user"/>
                            </div>

                            <div className="tag-category">
                                <h3 className="tag-category-title">
                                    {I18n.t('js.tag.model.articles_count')}
                                </h3>

                                <p className="tag-visibility">
                                    {this.props.tag.taggedArticlesCount}
                                </p>
                            </div>

                            <div className="tag-category">
                                <h3 className="tag-category-title">
                                    {I18n.t('js.tag.model.visibility')}
                                </h3>

                                <p className="tag-visibility">
                                    {this.props.tag.visibilityTranslated}
                                </p>
                            </div>

                            {
                                this.props.tag.synonyms &&
                                <div className="tag-category">
                                    <h3 className="tag-category-title">
                                        {I18n.t('js.tag.model.synonyms')}
                                    </h3>

                                    <p className="tag-visibility">
                                        {this.props.tag.synonyms.join(', ')}
                                    </p>
                                </div>
                            }

                            <div className="tag-category">
                                <h3 className="tag-category-title">
                                    {I18n.t('js.tag.common.stats.title')}
                                </h3>

                                <p className="tag-stats">
                                    {I18n.t('js.tag.common.stats.views')}
                                    {this.props.tag.viewsCount}
                                </p>
                                <p className="tag-stats">
                                    {I18n.t('js.tag.common.stats.clicks')}
                                    {this.props.tag.clicksCount}
                                </p>
                                <p className="tag-stats">
                                    {I18n.t('js.tag.common.stats.searches')}
                                    {this.props.tag.searchesCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-action article-action clearfix">
                    <div className="row">
                        <div className="col s12 m12 l6 md-margin-bottom-20">
                            <Link className="btn-flat waves-effect waves-light"
                                  to={`/`}>
                                {I18n.t('js.tag.show.back_button')}
                            </Link>
                        </div>

                        <div className="col s12 m12 l6 right-align">
                            <Link className="btn waves-effect waves-light"
                                  to={`/tag/${this.props.tag.slug}/edit`}>
                                {I18n.t('js.tag.show.edit_link')}
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
