'use strict';

import '../../../stylesheets/pages/tag/sort.scss';

import {
    tagsPath
} from '../../constants/routesHelper';

import {
    fetchTags,
    updateTagPriority
} from '../../actions';

import {
    sortItemLimit
} from '../modules/constants';

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import TagSorter from './sort/sorter';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    isFetching: state.tagState.isFetching,
    tags: state.tagState.tags
}), {
    fetchTags,
    updateTagPriority
})
@withRouter({params: true, navigate: true})
class TagSort extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
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
            .then(() => this.props.routeNavigate(tagsPath()));
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
