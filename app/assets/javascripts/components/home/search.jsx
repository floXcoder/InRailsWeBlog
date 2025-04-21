import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteQuery
} from '@js/actions/searchActions';

import withRouter from '@js/components/modules/router';

import {
    searchPath
} from '@js/constants/routesHelper';

import {
    autocompleteLimit,
    maxSearchRate
} from '@js/components/modules/constants';

import EnsureValidity from '@js/components/modules/ensureValidity';

import Loader from '@js/components/theme/loader';

import SearchArticleModule from '@js/components/search/module/article';
import SearchTagModule from '@js/components/search/module/tag';


class HomeSearch extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        // from connect
        query: PropTypes.string,
        isSearching: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentUserTopicId: PropTypes.number,
        isUserConnected: PropTypes.bool,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteQuery: PropTypes.func,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    componentWillUnmount() {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        this._handleFetch.cancel();
    }

    _handleChange = (event) => {
        const query = event.target.value;

        this.props.setAutocompleteQuery(query);

        this._handleFetch(query);
    };

    _handleFetch = Utils.debounce((query) => {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        this._request = this.props.fetchAutocomplete({
            // selectedTypes: ['article', 'tag', 'topic'],
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            tagIds: this.props.selectedTags.map((tag) => tag.id),
            limit: autocompleteLimit,
            global: true,
            noFragment: true
        });
    }, maxSearchRate);

    _performSearch = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (!this.props.query || this.props.query === '') {
            return;
        }

        this.props.routeNavigate({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _renderSearchForm = () => {
        return (
            <form autoComplete="off"
                  acceptCharset="UTF-8"
                  noValidate={true}
                  onSubmit={this._performSearch}>
                <EnsureValidity/>

                <div className="home-search-field">
                    <div className="home-search-icon">
                        <SearchIcon/>
                    </div>

                    <InputLabel className="home-input-label"
                                htmlFor="home-search">
                        Search
                    </InputLabel>

                    <Input id="home-search"
                           name="search"
                           type="search"
                           classes={{
                               root: 'home-input-root',
                               input: 'home-input-input'
                           }}
                           placeholder={I18n.t('js.views.home.search.placeholder')}
                           disableUnderline={true}
                           required={true}
                           value={this.props.query}
                           startAdornment={
                               <InputAdornment position="start">
                                   {
                                       this.props.selectedTags.map((tag) => (
                                           <Chip key={tag.id}
                                                 className="home-selected-tags-chip"
                                                 tabIndex={-1}
                                                 label={tag.name}
                                                 color="primary"
                                                 variant="outlined"
                                                 deleteIcon={<CancelIcon/>}/>
                                       ))
                                   }
                               </InputAdornment>
                           }
                           onChange={this._handleChange}/>
                </div>
            </form>
        );
    };

    _renderSearchResults = () => {
        return (
            <div>
                {
                    !!this.props.isSearching &&
                    <div className="home-search-loader">
                        <Loader size="big"/>
                    </div>
                }

                <Grid container={true}
                      spacing={8}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start">
                    <Grid size={{
                        xs: 12,
                        sm: 8,
                        md: 9
                    }}>
                        <SearchArticleModule isSearching={this.props.isSearching}
                                             isUserConnected={this.props.isUserConnected}
                                             currentUserId={this.props.currentUserId}
                                             currentTopicId={this.props.currentUserTopicId}
                                             hasQuery={true}
                                             hasParenthesis={false}
                                             hasTagIcon={true}
                                             selectedTags={this.props.selectedTags}
                                             articles={this.props.articles}/>
                    </Grid>

                    <Grid size={{
                        xs: 12,
                        sm: 4,
                        md: 3
                    }}>
                        <SearchTagModule isSearching={this.props.isSearching}
                                         isUserConnected={this.props.isUserConnected}
                                         currentUserId={this.props.currentUserId}
                                         currentTopicId={this.props.currentUserTopicId}
                                         hasQuery={true}
                                         hasSearchIcon={false}
                                         hasTagIcon={true}
                                         tags={this.props.tags}
                                         selectedTags={this.props.selectedTags}/>
                    </Grid>
                </Grid>
            </div>
        );
    };

    render() {
        const hasQuery = (this.props.query && this.props.query !== '') || this.props.selectedTags.length > 0;

        return (
            <section className="home-search">
                <div className="home-home-content">
                    <h2 className="home-search-title">
                        {I18n.t('js.views.home.search.title')}
                    </h2>

                    {this._renderSearchForm()}

                    {
                        !!hasQuery &&
                        this._renderSearchResults()
                    }

                    <div className="home-search-button">
                        <Button color="primary"
                                variant="contained"
                                onClick={this._performSearch}>
                            {I18n.t('js.views.home.search.button')}
                        </Button>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect((state) => ({
    query: state.autocompleteState.query,
    isSearching: state.autocompleteState.isFetching,
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId,
    isUserConnected: state.userState.isConnected,
    selectedTags: state.autocompleteState.selectedTags,
    highlightedTag: state.autocompleteState.highlightedTag,
    highlightedArticle: state.autocompleteState.highlightedArticle,
    tags: state.autocompleteState.tags,
    articles: state.autocompleteState.articles
}), {
    setAutocompleteQuery,
    fetchAutocomplete,
    setAutocompleteAction
})(withRouter({navigate: true})(HomeSearch));
