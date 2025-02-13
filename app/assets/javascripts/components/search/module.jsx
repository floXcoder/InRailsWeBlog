import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';

import CloseIcon from '@mui/icons-material/Close';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    searchPath
} from '@js/constants/routesHelper';

import {
    fetchUserRecents
} from '@js/actions/userActions';

import {
    setAutocompleteSelectedTag
} from '@js/actions/searchActions';

import {
    getUserRecentTags,
    getUserRecentArticles
} from '@js/selectors/userSelectors';

import {
    recentArticlesLimit
} from '@js/components/modules/constants';

import withRouter from '@js/components/modules/router';

import SearchTopicModule from '@js/components/search/module/topic';
import SearchTagModule from '@js/components/search/module/tag';
import SearchArticleModule from '@js/components/search/module/article';


class SearchModule extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        // from connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        recentTags: PropTypes.array,
        recentArticles: PropTypes.array,
        topics: PropTypes.array,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        highlightedTag: PropTypes.object,
        highlightedArticle: PropTypes.object,
        fetchUserRecents: PropTypes.func,
        setAutocompleteSelectedTag: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!window.seoMode && this.props.currentUserId) {
            this.props.fetchUserRecents(this.props.currentUserId, {limit: recentArticlesLimit}, {forceRefresh: true});
        }
    }

    _handleTagSelection = (tag) => {
        this.props.setAutocompleteSelectedTag(tag);
    };

    _performSearch = () => {
        this.props.routeNavigate({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _handleSearchClose = () => {
        this.props.routeNavigate({
            hash: undefined
        });
    };

    render() {
        const hasQuery = (this.props.query && this.props.query !== '') || this.props.selectedTags.length > 0;
        const tags = hasQuery ? this.props.tags : this.props.recentTags;
        const articles = hasQuery ? this.props.articles : this.props.recentArticles;

        return (
            <Paper className="search-module-results"
                   square={true}
                   elevation={4}>
                <div className="search-module-close show-on-small">
                    <IconButton aria-expanded={true}
                                aria-label="Close"
                                onClick={this._handleSearchClose}
                                size="large">
                        <CloseIcon color="primary"
                                   fontSize="large"/>
                    </IconButton>
                </div>

                <div className="search-module-container">
                    {
                        (this.props.query !== '' && this.props.selectedTags.length === 0) &&
                        <div className="search-module-help-message center-align">
                            {I18n.t('js.search.module.helpers.select_tag')}
                        </div>
                    }

                    <Grid container={true}
                          spacing={4}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid className="search-module-grid-item"
                              size={{
                                  xs: 12,
                                  sm: 8,
                                  md: 9
                              }}>
                            <SearchArticleModule isSearching={this.props.isSearching}
                                                 isUserConnected={this.props.isUserConnected}
                                                 currentUserId={this.props.currentUserId}
                                                 currentTopicId={this.props.currentTopicId}
                                                 hasQuery={hasQuery}
                                                 selectedTags={this.props.selectedTags}
                                                 highlightedArticleId={this.props.highlightedArticle?.id}
                                                 articles={articles}/>
                        </Grid>

                        <Grid className="search-module-grid-item"
                              size={{
                                  xs: 12,
                                  sm: 4,
                                  md: 3
                              }}>
                            <SearchTagModule isSearching={this.props.isSearching}
                                             isUserConnected={this.props.isUserConnected}
                                             currentUserId={this.props.currentUserId}
                                             currentUserSlug={this.props.currentUserSlug}
                                             currentTopicId={this.props.currentTopicId}
                                             currentUserTopicSlug={this.props.currentUserTopicSlug}
                                             hasQuery={hasQuery}
                                             tags={tags}
                                             selectedTags={this.props.selectedTags}
                                             highlightedTagId={this.props.highlightedTag?.id}
                                             onTagClick={this._handleTagSelection}/>

                            <SearchTopicModule topics={this.props.topics}/>
                        </Grid>
                    </Grid>

                    {
                        (!hasQuery && !this.props.isUserConnected) &&
                        <div className="search-module-default-message">
                            {I18n.t('js.search.module.default')}
                        </div>
                    }

                    <div className="search-module-search-button">
                        <Button color="primary"
                                variant="outlined"
                                onClick={this._performSearch}>
                            {I18n.t('js.search.module.button')}
                        </Button>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    recentTags: getUserRecentTags(state),
    recentArticles: getUserRecentArticles(state),
    isSearching: state.autocompleteState.isFetching,
    query: state.autocompleteState.query,
    highlightedTag: state.autocompleteState.highlightedTag,
    highlightedArticle: state.autocompleteState.highlightedArticle,
    topics: state.autocompleteState.topics,
    tags: state.autocompleteState.tags,
    selectedTags: state.autocompleteState.selectedTags,
    articles: state.autocompleteState.articles
}), {
    fetchUserRecents,
    setAutocompleteSelectedTag
})(withRouter({navigate: true})(SearchModule));