'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    fetchTags,
    updateTagPriority
} from '../../actions';

import {
    sortItemLimit
} from '../modules/constants';

import Loader from '../theme/loader';

import TagSorter from './sort/sorter';

export default @withRouter
@connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    isFetching: state.tagState.isFetching,
    tags: state.tagState.tags
}), {
    fetchTags,
    updateTagPriority
})
class TagSort extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        tags: PropTypes.array,
        fetchTags: PropTypes.func,
        updateTagPriority: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTags({
            userId: this.props.routeParams.currentUserId || this.props.currentUserId,
            order: 'priority_desc',
            ...this.props.routeParams
        }, {
            limit: sortItemLimit
        });
    }

    _handleUpdatePriority = (tagIds) => {
        this.props.updateTagPriority(tagIds)
            .then(() => this.props.history.push(`/tags/${this.props.currentUserSlug}`));
    };

    render() {
        if (this.props.isFetching && this.props.tags.length === 0) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div className="tag-sort">
                {
                    this.props.tags.length > 0 &&
                    <TagSorter key={Utils.uuid()}
                               tags={this.props.tags}
                               userSlug={this.props.currentUserSlug}
                               updateTagPriority={this._handleUpdatePriority}/>
                }
            </div>
        );
    }
}
