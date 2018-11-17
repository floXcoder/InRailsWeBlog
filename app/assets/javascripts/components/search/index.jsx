'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import SearchIcon from '@material-ui/icons/Search';

import {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    fetchSearch,
    filterSearch,
    spyTrackClick
} from '../../actions';

import {
    getSelectedTags,
    getArticleSuggestions,
    getTagSuggestions,
    getSearchTags,
    getSearchArticles
} from '../../selectors';

import SearchSuggestionIndex from './index/suggestion';
import SearchSelectedIndex from './index/selected';
import SearchTagIndex from './index/tag';
import SearchArticleIndex from './index/article';

import ArticleBreadcrumbDisplay from '../articles/display/breadcrumb';

import EnsureValidity from '../modules/ensureValidity';

import styles from '../../../jss/search/index';

export default @hot(module)

@connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUser: state.userState.user,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentTopic: state.topicState.currentTopic,
    query: state.searchState.query,
    isSearching: state.searchState.isSearching,
    selectedTags: getSelectedTags(state),
    tagSuggestions: getTagSuggestions(state),
    articleSuggestions: getArticleSuggestions(state),
    tags: getSearchTags(state),
    articles: getSearchArticles(state)
}), {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    fetchSearch,
    filterSearch
})
@withStyles(styles)
class SearchIndex extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // from connect
        currentUserId: PropTypes.number,
        currentUser: PropTypes.object,
        currentUserTopicId: PropTypes.number,
        currentTopic: PropTypes.object,
        query: PropTypes.string,
        isSearching: PropTypes.bool,
        selectedTags: PropTypes.array,
        tagSuggestions: PropTypes.array,
        articleSuggestions: PropTypes.array,
        tags: PropTypes.array,
        articles: PropTypes.array,
        getSearchContext: PropTypes.func,
        searchOnHistoryChange: PropTypes.func,
        setSelectedTag: PropTypes.func,
        fetchSearch: PropTypes.func,
        filterSearch: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    state = {
        previousQuery: undefined,
        value: this.props.query || ''
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.previousQuery !== nextProps.query) {
            return {
                previousQuery: nextProps.query,
                value: nextProps.query
            };
        }

        return null;
    }

    componentDidMount() {
        // Retrieve search from url or history
        this.props.getSearchContext();

        // Save search in browser history
        this.props.searchOnHistoryChange();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedTags.length !== this.props.selectedTags.length) {
            this._performSearch(this.props.query);
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleChange = (event) => {
        const value = event.target.value;

        this.setState({
            value
        });
    };

    _handleSuggestionClick = (suggestion) => {
        this._performSearch(suggestion);
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);
    };

    _handleArticleClick = (article) => {
        spyTrackClick('article', article.id, article.slug, article.title);

        this.props.history.push(`/users/${article.user.slug}/articles/${article.slug}`);
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        this._performSearch(this.state.value);
    };

    _handleFilter = (filter) => {
        let filters = {};

        if (filter === 'priority') {
            filters.order = 'priority_desc';
        } else if (filter === 'date') {
            filters.order = 'updated_desc';
        } else if (filter === 'all_topics') {
            filters.topicId = undefined;
        }

        this.props.filterSearch(filters);
    };

    _performSearch = (query) => {
        this._request = this.props.fetchSearch({
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            tagIds: this.props.selectedTags.map((tag) => tag.id)
        });
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                {
                    (this.props.currentUser && this.props.currentTopic) &&
                    <div className={this.props.classes.breadcrumb}>
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}/>
                    </div>
                }

                <form onSubmit={this._handleSubmit}>
                    <EnsureValidity/>

                    <Grid container={true}
                          spacing={32}
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item={true}
                              className={this.props.classes.inputItem}>
                            <FormControl classes={{
                                root: this.props.classes.inputForm
                            }}>
                                <Input classes={{
                                    input: this.props.classes.inputInput
                                }}
                                       type="search"
                                       autoFocus={true}
                                       placeholder={I18n.t('js.search.index.placeholder')}
                                       value={this.state.value}
                                       onChange={this._handleChange}
                                       onSubmit={this._handleSubmit}
                                       startAdornment={
                                           <InputAdornment position="start">
                                               <SearchIcon/>
                                           </InputAdornment>
                                       }
                                />
                            </FormControl>
                        </Grid>

                        <Grid item={true}>
                            <Button color="primary"
                                    variant="outlined"
                                    onClick={this._handleSubmit}>
                                {I18n.t('js.search.index.button')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {
                    !Utils.isEmpty(this.props.selectedTags) &&
                    <SearchSelectedIndex selectedTags={this.props.selectedTags}
                                         className="article-category"
                                         onTagClick={this._handleTagSelection}/>
                }

                <SearchSuggestionIndex classes={this.props.classes}
                                       articleSuggestions={this.props.articleSuggestions}
                                       tagSuggestions={this.props.tagSuggestions}
                                       onSuggestionClick={this._handleSuggestionClick}/>

                <Grid container={true}
                      spacing={32}
                      direction="row-reverse"
                      justify="space-between"
                      alignItems="flex-start">
                    {
                        !Utils.isEmpty(this.props.tags) &&
                        <Grid item={true}
                              xs={12}
                              sm={Utils.isEmpty(this.props.articles) ? 12 : 6}
                              lg={Utils.isEmpty(this.props.articles) ? 12 : 3}>
                            <SearchTagIndex classes={this.props.classes}
                                            tags={this.props.tags}
                                            isSearching={this.props.isSearching}
                                            onTagClick={this._handleTagSelection}/>
                        </Grid>
                    }

                    {
                        !Utils.isEmpty(this.props.articles) &&
                        <Grid item={true}
                              xs={12}
                              sm={Utils.isEmpty(this.props.tags) ? 12 : 6}
                              lg={Utils.isEmpty(this.props.tags) ? 12 : 9}>
                            <SearchArticleIndex classes={this.props.classes}
                                                articles={this.props.articles}
                                                isSearching={this.props.isSearching}
                                                onFilter={this._handleFilter}
                                                onArticleClick={this._handleArticleClick}/>
                        </Grid>
                    }
                </Grid>
            </div>
        );
    }
}
