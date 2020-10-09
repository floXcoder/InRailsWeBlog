'use strict';

import {
    withRouter
} from 'react-router-dom';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteQuery
} from '../../actions';

import {
    searchPath
} from '../../constants/routesHelper';

import {
    autocompleteLimit,
    maxSearchRate
} from '../modules/constants';

import EnsureValidity from '../modules/ensureValidity';

import Loader from '../theme/loader';

import SearchArticleModule from '../search/module/article';
import SearchTagModule from '../search/module/tag';

export default @withRouter
@connect((state) => ({
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
})
class HomeSearch extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
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

    _performSearch = () => {
        if (!this.props.query || this.props.query === '') {
            return;
        }

        this.props.history.push({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _renderSearchForm = () => {
        return (
            <form className=""
                  autoComplete="off"
                  acceptCharset="UTF-8">
                <EnsureValidity/>

                <div className={this.props.classes.searchField}>
                    <div className={this.props.classes.searchIcon}>
                        <SearchIcon/>
                    </div>

                    <InputLabel className={this.props.classes.inputLabel}
                                htmlFor="home-search">
                        Search
                    </InputLabel>

                    <Input id="home-search"
                           name="search"
                           type="search"
                           classes={{
                               root: this.props.classes.inputRoot,
                               input: this.props.classes.inputInput
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
                                                 className={this.props.classes.selectedTagsChip}
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
                    this.props.isSearching &&
                    <div className={this.props.classes.searchLoader}>
                        <Loader size="big"/>
                    </div>
                }

                <Grid container={true}
                      spacing={8}
                      direction="row"
                      justify="space-between"
                      alignItems="flex-start">
                    <Grid item={true}
                          xs={12}
                          sm={8}
                          md={9}
                          lg={9}>
                        <SearchArticleModule classes={this.props.classes}
                                             isUserConnected={this.props.isUserConnected}
                                             currentUserId={this.props.currentUserId}
                                             currentTopicId={this.props.currentUserTopicId}
                                             hasQuery={true}
                                             hasParenthesis={false}
                                             hasTagIcon={true}
                                             selectedTags={this.props.selectedTags}
                                             articles={this.props.articles}/>
                    </Grid>

                    <Grid item={true}
                          xs={12}
                          sm={4}
                          md={3}
                          lg={3}>
                        <SearchTagModule classes={this.props.classes}
                                         isUserConnected={this.props.isUserConnected}
                                         currentUserId={this.props.currentUserId}
                                         currentTopicId={this.props.currentUserTopicId}
                                         hasQuery={true}
                                         hasSearchIcon={false}
                                         hasTagIcon={true}
                                         tags={this.props.tags}
                                         selectedTags={this.props.selectedTags}
                                         onTagClick={this._handleTagSelection}/>
                    </Grid>
                </Grid>
            </div>
        );
    };

    render() {
        const hasQuery = (this.props.query && this.props.query !== '') || this.props.selectedTags.length > 0;

        return (
            <section className={this.props.classes.search}>
                <div className={this.props.classes.homeContent}>
                    <h2 className={this.props.classes.searchTitle}>
                        {I18n.t('js.views.home.search.title')}
                    </h2>

                    {this._renderSearchForm()}

                    {
                        hasQuery &&
                        this._renderSearchResults()
                    }

                    <div className={this.props.classes.searchButton}>
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
