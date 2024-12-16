import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import List from '@mui/material/List';

import {
    // filterTags,
    spyTrackClick
} from '@js/actions/metricsActions';

import {
    getSortedTopicTags
} from '@js/selectors/tagSelectors';

import Loader from '@js/components/theme/loader';
// import SearchBar from '@js/components/theme/searchBar';

// import AssociatedTagBox from '@js/components/tags/associated/box';

// import TagSidebarCloud from '@js/components/tags/sidebar/cloud';
import TagSidebarList from '@js/components/tags/sidebar/list';


class TagSidebar extends React.Component {
    static propTypes = {
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
        isCloud: PropTypes.bool,
        isOpen: PropTypes.bool,
        hasChildInMainList: PropTypes.bool,
        onTagClick: PropTypes.func,
        // from connect
        isLoading: PropTypes.bool,
        filterText: PropTypes.string,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        // currentUserTopics: PropTypes.array,
        tags: PropTypes.array,
        // filterTags: PropTypes.func
    };

    static defaultProps = {
        isCloud: false
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tagId, tagSlug, tagUserId, tagName) => {
        if (this.props.onTagClick) {
            this.props.onTagClick();
        }

        spyTrackClick('tag', tagId, tagSlug, tagUserId, tagName, null);
    };

    // _handleSearchInput = (value) => {
    //     this.props.filterTags(value);
    // };

    render() {
        if (this.props.isLoading) {
            return (
                <List>
                    <div className="center">
                        <Loader/>
                    </div>
                </List>
            );
            // } else if (this.props.isCloud) {
            //     return (
            //         <TagSidebarCloud currentUserSlug={this.props.currentUserSlug}
            //                          currentTagSlug={this.props.currentTagSlug}
            //                          currentUserTopics={this.props.currentUserTopics}
            //                          tags={this.props.tags}
            //                          onTagClick={this._handleTagClick}/>
            //     );
        } else {
            return (
                <TagSidebarList currentUserSlug={this.props.currentUserSlug}
                                currentUserTopicSlug={this.props.currentUserTopicSlug}
                                filterText={this.props.filterText}
                                currentTagSlug={this.props.currentTagSlug}
                                currentChildTagSlug={this.props.currentChildTagSlug}
                                hasChildInMainList={this.props.hasChildInMainList}
                                isOpen={this.props.isOpen}
                                isCloud={this.props.isCloud}
                                tags={this.props.tags}
                                onTagClick={this._handleTagClick}/>
            );
        }
    }
}

export default connect((state, props) => ({
    isLoading: state.tagState.isFetching,
    filterText: state.tagState.filterText,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    // currentUserTopics: props.isCloud ? state.topicState.userTopics : undefined,
    tags: props.isCloud ? state.tagState.tags : getSortedTopicTags(state)
}), {
    // filterTags
})(TagSidebar);
