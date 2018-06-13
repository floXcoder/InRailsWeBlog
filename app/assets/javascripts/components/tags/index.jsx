'use strict';

import {
    Link
} from 'react-router-dom';

import {
    fetchTags,
    spyTrackClick
} from '../../actions';

import {
    getPublicTags,
    getPrivateTags
} from '../../selectors';

import Loader from '../theme/loader';

@connect((state) => ({
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    isFetching: state.tagState.isFetching,
    publicTags: getPublicTags(state),
    privateTags: getPrivateTags(state)
}), {
    fetchTags
})
export default class TagIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        publicTags: PropTypes.array,
        privateTags: PropTypes.array,
        fetchTags: PropTypes.func
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
                 className="col s4">
                <div className="tag-item">
                    <Link className="tag-default"
                          to={`/tag/${tag.slug}`}
                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                        {tag.name}
                    </Link>

                    <span className="tag-count">
                        {tag.taggedArticlesCount}
                    </span>

                    {
                        tag.description &&
                        <p className="tag-desc">
                            {tag.description}
                        </p>
                    }

                    {
                        tag.synonyms.length > 0 &&
                        <p className="tag-synonyms">
                            {I18n.t('js.tag.model.synonyms') + ' : '}
                            {tag.synonyms.join(', ')}
                        </p>
                    }
                </div>
            </div>
        );
    };

    render() {

        return (
            <div className="card blog-tags">
                {
                    this.props.isFetching &&
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                }

                <div className="margin-bottom-20">
                    <h1 className="tag-title">
                        {this._renderTitle()}
                    </h1>

                    <h2 className="tag-subtitle">
                        {I18n.t('js.tag.common.publics')}
                    </h2>

                    {
                        this.props.publicTags.length > 0
                            ?
                            <div className="row tag-publics">
                                {
                                    this.props.publicTags.map(this._renderTagItem)
                                }
                            </div>
                            :
                            <span className="tag-no-parents">
                                {I18n.t('js.tag.common.no_publics')}
                            </span>
                    }
                </div>

                {
                    (!Utils.isEmpty(this.props.params)) &&
                    <div className="margin-bottom-20">
                        <h2 className="tag-subtitle">
                            {I18n.t('js.tag.common.privates')}
                        </h2>

                        {
                            this.props.privateTags.length > 0
                                ?
                                <div className="row tag-privates">
                                    {
                                        this.props.privateTags.map(this._renderTagItem)
                                    }
                                </div>
                                :
                                <span className="tag-no-parents">
                                {I18n.t('js.tag.common.no_privates')}
                            </span>
                        }
                    </div>
                }

                <div className="margin-bottom-20">
                    <div className="row">
                        {
                            this.props.currentUser &&
                            <div className="col s6 center-align">
                                <Link className="btn-flat waves-effect waves-light"
                                      to={`/tags/${this.props.currentUser.slug}`}>
                                    {I18n.t('js.tag.index.links.user_tags')}
                                </Link>
                            </div>
                        }

                        <div className="col s6 center-align">
                            <Link className="btn-flat waves-effect waves-light"
                                  to={'/tags'}>
                                {I18n.t('js.tag.index.links.all_tags')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
