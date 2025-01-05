import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import * as Utils from '@js/modules/utils';

import {
    tagsPath
} from '@js/constants/routesHelper';

import {
    fetchTags,
    updateTagPriority
} from '@js/actions/tagActions';

import {
    sortItemLimit
} from '@js/components/modules/constants';

import withRouter from '@js/components/modules/router';

import Loader from '@js/components/theme/loader';

import TagSorter from '@js/components/tags/sort/sorter';

import '@css/pages/tag/sort.scss';


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

export default connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    isFetching: state.tagState.isFetching,
    tags: state.tagState.tags
}), {
    fetchTags,
    updateTagPriority
})(withRouter({
    params: true,
    navigate: true
})(TagSort));