'use strict';

import '../../../stylesheets/pages/search/index.scss';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    setSearchQuery,
    fetchAutocomplete,
    setAutocompleteSelectedTag,
    fetchSearch,
    filterSearch,
    searchInURLs,
    updateUserSettings,
    showUserPreference
} from '../../actions';

import {
    maxSearchRate,
    autocompleteLimit,
    searchGridColumns,
    searchGridColumnsMobile
} from '../modules/constants';

import withRouter from '../modules/router';

import EnsureValidity from '../modules/ensureValidity';

import Loader from '../theme/loader';

import SearchSuggestionIndex from './index/suggestion';
import SearchTagIndex from './index/tag';
import SearchArticleIndex from './index/article';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUser: state.userState.user,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicMode: state.topicState.currentTopic?.mode,
    searchDisplay: state.userState.user?.settings?.searchDisplay,
    query: state.searchState.query,
    selectedTags: state.searchState.selectedTags,
    isSearching: state.searchState.isSearching,
    // hasResults: state.searchState.hasResults,
    tags: state.searchState.tags,
    tagSuggestions: state.searchState.tagSuggestions,
    autocompleteTags: state.autocompleteState.tags,
    articles: state.searchState.articles,
    articleSuggestions: state.searchState.articleSuggestions,
    scrapQuery: state.searchState.scrapQuery
}), {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    setSearchQuery,
    fetchAutocomplete,
    setAutocompleteSelectedTag,
    fetchSearch,
    filterSearch,
    searchInURLs,
    updateUserSettings,
    showUserPreference
})
@withRouter({params: true})
class SearchIndex extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        currentUser: PropTypes.object,
        currentUserTopicId: PropTypes.number,
        currentUserTopicMode: PropTypes.string,
        searchDisplay: PropTypes.string,
        query: PropTypes.string,
        selectedTags: PropTypes.array,
        isSearching: PropTypes.bool,
        // hasResults: PropTypes.bool,
        tags: PropTypes.array,
        tagSuggestions: PropTypes.array,
        autocompleteTags: PropTypes.array,
        articles: PropTypes.array,
        articleSuggestions: PropTypes.array,
        scrapQuery: PropTypes.string,
        getSearchContext: PropTypes.func,
        searchOnHistoryChange: PropTypes.func,
        setSelectedTag: PropTypes.func,
        setSearchQuery: PropTypes.func,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteSelectedTag: PropTypes.func,
        fetchSearch: PropTypes.func,
        filterSearch: PropTypes.func,
        searchInURLs: PropTypes.func,
        updateUserSettings: PropTypes.func,
        showUserPreference: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    state = {
        highlightedTagId: null,
        forceDisplay: undefined
    };

    componentDidMount() {
        // Retrieve search from url or history
        this.props.getSearchContext(this.props.routeParams);

        // Save search in browser history
        this.props.searchOnHistoryChange();
    }

    componentDidUpdate(prevProps) {
        if (this.props.scrapQuery && prevProps.scrapQuery !== this.props.scrapQuery) {
            this._handleURLSearchSubmit(false, this.props.scrapQuery);
        }
    }

    componentWillUnmount() {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        this._handleFetch.cancel();
    }

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (this.props.query.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
                    this._handleSubmit(event);
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'tab') {
                    event.preventDefault();

                    if (this.props.tags.length > 0) {
                        const tagIndex = this.state.highlightedTagId ? this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) : 0;

                        this.props.setSelectedTag(this.props.tags[tagIndex]);

                        this.props.setSearchQuery('');

                        this.setState({
                            highlightedTagId: null
                        });
                    } else if (this.props.autocompleteTags.length > 0) {
                        const tagIndex = this.state.highlightedTagId ? this.props.autocompleteTags.findIndex((tag) => tag.id === this.state.highlightedTagId) : 0;

                        this.props.setSelectedTag(this.props.autocompleteTags[tagIndex]);

                        this.props.setSearchQuery('');

                        this.setState({
                            highlightedTagId: null
                        });

                        this.props.setAutocompleteSelectedTag(this.props.autocompleteTags[tagIndex]);
                    }
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'up') {
                    if (this.props.tags.length > 0) {
                        let newTagId;
                        if (!this.state.highlightedTagId || this.state.highlightedTagId === this.props.tags.first().id) {
                            newTagId = this.props.tags[this.props.tags.length - 1].id;
                        } else {
                            newTagId = this.props.tags[this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) - 1].id;
                        }

                        this.setState({
                            highlightedTagId: newTagId
                        });
                    }
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'down') {
                    if (this.props.tags.length > 0) {
                        let newTagId;
                        if (!this.state.highlightedTagId || this.state.highlightedTagId === this.props.tags[this.props.tags.length - 1].id) {
                            newTagId = this.props.tags[0].id;
                        } else {
                            newTagId = this.props.tags[this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) + 1].id;
                        }

                        this.setState({
                            highlightedTagId: newTagId
                        });
                    }
                }
            } else if (this.props.query.length === 0 && this.props.selectedTags.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'backspace') {
                    event.preventDefault();

                    this.props.setSelectedTag(this.props.selectedTags[this.props.selectedTags.length - 1]);
                }
            }
        }
    };

    _handleChange = (event) => {
        const query = event.target.value;

        this.props.setSearchQuery(query);

        this._handleFetch(query);
    };

    _handleFetch = Utils.debounce((query) => {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        // Autocomplete tags only
        this._request = this.props.fetchAutocomplete({
            selectedTypes: ['tag'],
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            tagIds: this.props.selectedTags.map((tag) => tag.id),
            limit: autocompleteLimit
        });
    }, maxSearchRate);

    _handleSuggestionClick = (suggestion) => {
        this._performSearch(suggestion);
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);

        this.props.setAutocompleteSelectedTag();

        this.props.setSearchQuery('');
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        this._performSearch(this.props.query);
    };

    _handleOrderChange = (order) => {
        const orders = {};

        if (order === 'priority') {
            orders.order = 'priority_desc';
        } else if (order === 'date') {
            orders.order = 'created_desc';
        }

        this.props.filterSearch(orders);
    };

    _handleDisplayChange = (display) => {
        if (this.props.currentUserId) {
            this.props.updateUserSettings(this.props.currentUserId, {
                searchDisplay: display
            });
        }

        this.setState({
            forceDisplay: display
        });
    };

    _handleURLSearchSubmit = (event, urlQuery) => {
        if (event) {
            event.preventDefault();
        }

        if (this.props.currentUserId) {
            Notification.alert(I18n.t('js.search.scrap.message.fetching'));

            let data;
            if (event) {
                const form = event.target;
                data = new FormData(form);
            } else {
                data = new FormData();
                data.append('search[query_url]', urlQuery);
            }

            data.append('search[article_ids]', this.props.articles.map((article) => article.id));

            this.props.searchInURLs(data)
                .then(() => Notification.success(I18n.t('js.search.scrap.message.result')));
        }
    };

    _performSearch = (query) => {
        this.props.setAutocompleteSelectedTag();

        this._request = this.props.fetchSearch({
            query,
            tags: this.props.selectedTags.map((tag) => tag.slug),
            global: true
        });
    };

    render() {
        if (this.props.currentUserId && !this.props.currentUser) {
            return (
                <div className="search-index-root">
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        // const hasNoResults = (this.props.query?.length > 0) && !this.props.hasResults;

        const isDesktop = window.innerWidth > window.settings.medium_screen_up;

        const searchDisplay = this.state.forceDisplay || (this.props.currentUserTopicMode === 'inventories' ? 'grid' : this.props.searchDisplay) || 'card';

        return (
            <div className="search-index-root">
                <form onSubmit={this._handleSubmit}>
                    <EnsureValidity/>

                    <Grid container={true}
                          spacing={4}
                          direction="row"
                          justifyContent="center"
                          alignItems="center">
                        <Grid 
                              className="search-index-input-item">
                            <FormControl classes={{
                                root: 'search-index-input-form'
                            }}>
                                <div className="search-index-search-icon">
                                    <SearchIcon fontSize="large"/>
                                </div>

                                <Input name="search"
                                       type="search"
                                       classes={{
                                           root: 'search-index-input-root',
                                           input: 'search-index-input-search'
                                       }}
                                       autoFocus={isDesktop}
                                       placeholder={I18n.t('js.search.index.placeholder')}
                                       value={this.props.query}
                                       startAdornment={
                                           <InputAdornment position="start">
                                               {
                                                   this.props.selectedTags.map((tag) => (
                                                       <Chip key={tag.id}
                                                             className="search-index-input-tag"
                                                             tabIndex={-1}
                                                             label={tag.name}
                                                             color="primary"
                                                             variant="outlined"
                                                             deleteIcon={<CancelIcon/>}
                                                             onClick={this._handleTagSelection.bind(this, tag)}
                                                             onDelete={this._handleTagSelection.bind(this, tag)}/>
                                                   ))
                                               }
                                           </InputAdornment>
                                       }
                                       onKeyDown={this._handleKeyDown}
                                       onChange={this._handleChange}
                                       onSubmit={this._handleSubmit}/>
                            </FormControl>
                        </Grid>

                        <Grid 
                              className="search-index-searchButton">
                            <Button color="primary"
                                    variant="outlined"
                                    onClick={this._handleSubmit}>
                                {I18n.t('js.search.index.button')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {
                    !!this.props.isSearching &&
                    <div className="center margin-top-35 margin-bottom-60">
                        <Loader size="big"/>
                    </div>
                }

                <SearchSuggestionIndex articleSuggestions={this.props.articleSuggestions}
                                       tagSuggestions={this.props.tagSuggestions}
                                       onSuggestionClick={this._handleSuggestionClick}/>

                {
                    this.props.autocompleteTags.length > 0 &&
                    <SearchTagIndex isAutocomplete={true}
                                    tags={this.props.autocompleteTags}
                                    highlightedTagId={this.state.highlightedTagId}
                                    onTagClick={this._handleTagSelection}/>
                }

                {
                    // hasNoResults &&
                    // <div className={search-index-helpMessage}>
                    //     {I18n.t('js.search.index.no_results')}
                    // </div>
                }

                {
                    this.props.tags.length > 0 &&
                    <SearchTagIndex tags={this.props.tags}
                                    highlightedTagId={this.state.highlightedTagId}
                                    onTagClick={this._handleTagSelection}/>
                }

                {
                    this.props.articles.length > 0 &&
                    <SearchArticleIndex currentUserId={this.props.currentUserId}
                                        currentUserTopicId={this.props.currentUserTopicId}
                                        selectedTagIds={this.props.selectedTags.map((tag) => tag.id)}
                                        articles={this.props.articles}
                                        searchDisplay={searchDisplay}
                                        searchGridColumns={isDesktop ? searchGridColumns : searchGridColumnsMobile}
                                        onSettingsClick={this.props.showUserPreference}
                                        onOrderChange={this._handleOrderChange}
                                        onDisplayChange={this._handleDisplayChange}
                                        onURLSearchSubmit={this._handleURLSearchSubmit}/>
                }

                {
                    (!this.props.articles.length && !this.props.isSearching) &&
                    <div className="search-index-help-message">
                        {I18n.t('js.search.index.no_results')}
                    </div>
                }
            </div>
        );
    }
}
