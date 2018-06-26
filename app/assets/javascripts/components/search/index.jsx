'use strict';

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

import EnsureValidity from '../modules/ensureValidity';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopicId,
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
export default class SearchIndex extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
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
        filterSearch: PropTypes.func
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

        this.props.history.push(`/article/${article.slug}`);
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
            topicId: this.props.currentTopicId,
            tagIds: this.props.selectedTags.map((tag) => tag.id)
        });
    };

    render() {
        return (
            <div className="search-index">
                <div className="search-input">
                    <div className="search-form">
                        <form onSubmit={this._handleSubmit}>
                            <EnsureValidity/>

                            <div className="row margin-bottom-5">
                                <div className="col s12 m8 l9 xl10">
                                    <div className="input-field">
                                <span className="material-icons prefix"
                                      data-icon="search"
                                      aria-hidden="true"/>
                                        <input type="search"
                                               placeholder={I18n.t('js.search.index.placeholder')}
                                               autoFocus={true}
                                               value={this.state.value}
                                               onChange={this._handleChange}
                                               onSubmit={this._handleSubmit}/>
                                    </div>
                                </div>

                                <div className="col s12 m4 l3 xl2">
                                    <div className="valign-wrapper">
                                        <button className="btn search-form-submit"
                                                onClick={this._handleSubmit}>
                                            {I18n.t('js.search.index.button')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {
                        !Utils.isEmpty(this.props.selectedTags) &&
                        <SearchSelectedIndex selectedTags={this.props.selectedTags}
                                             className="article-category"
                                             onTagClick={this._handleTagSelection}/>
                    }
                </div>

                <SearchSuggestionIndex articleSuggestions={this.props.articleSuggestions}
                                       tagSuggestions={this.props.tagSuggestions}
                                       onSuggestionClick={this._handleSuggestionClick}/>

                {
                    !Utils.isEmpty(this.props.tags) &&
                    <SearchTagIndex tags={this.props.tags}
                                    isSearching={this.props.isSearching}
                                    onTagClick={this._handleTagSelection}/>
                }

                {
                    !Utils.isEmpty(this.props.articles) &&
                    <SearchArticleIndex articles={this.props.articles}
                                        isSearching={this.props.isSearching}
                                        onFilter={this._handleFilter}
                                        onArticleClick={this._handleArticleClick}/>
                }
            </div>
        );
    }
}
