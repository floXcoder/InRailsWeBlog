'use strict';

import {
    getSearchHistory,
    searchOnHistoryChange,
    fetchSearch
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

@connect((state) => ({
    query: state.searchState.query,
    isSearching: state.searchState.isSearching,
    selectedTags: getSelectedTags(state),
    tagSuggestions: getTagSuggestions(state),
    articleSuggestions: getArticleSuggestions(state),
    tags: getSearchTags(state),
    articles: getSearchArticles(state)
}), {
    getSearchHistory,
    searchOnHistoryChange,
    fetchSearch
})
export default class SearchIndex extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // From connect
        query: PropTypes.string,
        isSearching: PropTypes.bool,
        selectedTags: PropTypes.array,
        tagSuggestions: PropTypes.array,
        articleSuggestions: PropTypes.array,
        tags: PropTypes.array,
        articles: PropTypes.array,
        getSearchHistory: PropTypes.func,
        searchOnHistoryChange: PropTypes.func,
        fetchSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        value: ''
    };

    componentDidMount() {
        // Retrieve search history if any
        this.props.getSearchHistory();

        // Save search in browser history
        this.props.searchOnHistoryChange();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.query !== nextProps.query) {
            this.setState({
               value: nextProps.query
            });
        }
    }

    _handleChange = (event) => {
        const value = event.target.value;

        this.setState({
            value
        });
    };

    _handleSuggestionClick = (suggestion) => {
        this.props.fetchSearch({
            query: suggestion,
            selectedTags: this.props.selectedTags
        });
    };

    _handleTagSelection = () => {

    };

    _handleArticleClick = (article) => {
        this.props.history.push(`/article/${article.slug}`)
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        this.props.fetchSearch({
            query: this.state.value,
            selectedTags: this.props.selectedTags
        });
    };

    render() {
        const suggestions = this.props.articleSuggestions.concat(this.props.tagSuggestions);

        return (
            <div className="search-index">
                <div className="search-input">
                    <form onSubmit={this._handleSubmit}>
                        <input ref={(input) => this._searchInput = input}
                               type="search"
                               placeholder={I18n.t('js.search.index.placeholder')}
                               autoFocus={true}
                               onChange={this._handleChange}
                               value={this.state.value}/>
                    </form>


                    {
                        this.props.selectedTags.length > 0 &&
                        <SearchSelectedIndex selectedTags={this.props.selectedTags}
                                             onTagClick={this._handleTagSelection}/>
                    }
                </div>

                <SearchSuggestionIndex suggestions={suggestions}
                                       onSuggestionClick={this._handleSuggestionClick}/>

                <SearchTagIndex tags={this.props.tags}
                                isSearching={this.props.isSearching}
                                onTagClick={this._handleTagSelection}/>

                <SearchArticleIndex articles={this.props.articles}
                                    isSearching={this.props.isSearching}
                                    onArticleClick={this._handleArticleClick}/>
            </div>
        );
    }
}
