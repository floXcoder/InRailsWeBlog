'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../actions';

import {
    getPublicTags,
    getPrivateTags
} from '../../selectors';

import Loader from '../theme/loader';

@connect((state) => ({
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopicId,
    currentTopicSlug: state.topicState.currentTopic && state.topicState.currentTopic.slug,
    isFetching: state.tagState.isFetching,
    publicTags: getPublicTags(state),
    privateTags: getPrivateTags(state)
}))
export default class TagIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        currentTopicSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        publicTags: PropTypes.array,
        privateTags: PropTypes.array
    };

    constructor(props) {
        super(props);

        // Tag already loaded by sidebar
        // props.fetchTags({
        //     userId: props.params.currentUserId || props.currentUserId,
        //     ...props.params
        // }, {
        //     limit: 1000
        // });
    }

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
                    <h2 className="tag-subtitle">
                        {I18n.t('js.tag.common.publics')}
                    </h2>

                    {
                        this.props.publicTags.length > 0
                            ?
                            <ul className="tag-publics">
                                {
                                    this.props.publicTags.map((tag) => (
                                        <li key={tag.id}
                                            className="tag-item">
                                            <Link className="tag-default"
                                                  to={`/tag/${tag.slug}`}
                                                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                {tag.name}
                                            </Link>

                                            <span>
                                                {tag.description}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                            :
                            <span className="tag-no-parents">
                                {I18n.t('js.tag.common.no_publics')}
                            </span>
                    }
                </div>

                <div className="margin-bottom-20">
                    <h2 className="tag-subtitle">
                        {I18n.t('js.tag.common.privates')}
                    </h2>

                    {
                        this.props.privateTags.length > 0
                            ?
                            <ul className="tag-privates">
                                {
                                    this.props.privateTags.map((tag) => (
                                        <li key={tag.id}
                                            className="tag-item">
                                            <Link className="tag-default"
                                                  to={`/tag/${tag.slug}`}
                                                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                                {tag.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            :
                            <span className="tag-no-parents">
                                {I18n.t('js.tag.common.no_privates')}
                            </span>
                    }
                </div>
            </div>
        );
    }
}
