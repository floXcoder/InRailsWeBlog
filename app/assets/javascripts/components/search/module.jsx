'use strict';

import _ from 'lodash';

import {
    setSelectedTag,
    fetchUserRecents,
    fetchSearch
} from '../../actions';

import {
    getUserRecentTopics,
    getUserRecentTags,
    getUserRecentArticles,
    getSelectedTags,
    getAutocompleteTags,
    getAutocompleteArticles
} from '../../selectors';

import Loader from '../theme/loader';

import SearchSelectedModule from './module/selected';
import SearchTagModule from './module/tag';
import SearchArticleModule from './module/article';

@connect((state) => ({
    currentUserId: state.userState.currentId,
    recentTopics: getUserRecentTopics(state),
    recentTags: getUserRecentTags(state),
    recentArticles: getUserRecentArticles(state),
    isSearching: state.autocompleteState.isFetching,
    query: state.autocompleteState.query,
    actionKey: state.autocompleteState.actionKey,
    tags: getAutocompleteTags(state),
    selectedTags: getSelectedTags(state),
    articles: getAutocompleteArticles(state)
}), {
    setSelectedTag,
    fetchUserRecents,
    fetchSearch
})
export default class SearchModule extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // From connect
        currentUserId: PropTypes.number,
        recentTopics: PropTypes.array,
        recentTags: PropTypes.array,
        recentArticles: PropTypes.array,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        actionKey: PropTypes.string,
        setSelectedTag: PropTypes.func,
        fetchUserRecents: PropTypes.func,
        fetchSearch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    state = {
        highlightedTagIndex: undefined
    };

    componentDidUpdate(prevProps) {
        if (this.props.query !== prevProps.query) {
            this._resetTagSelection();
        }

        if (prevProps.actionKey && prevProps.actionKey !== ' ') {
            if (this._handleKeyAction()[prevProps.actionKey]) {
                this._handleKeyAction()[prevProps.actionKey].call(this, prevProps.actionKey);
            }
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleKeyAction = () => {
        return {
            ArrowDown() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === this.props.tags.length - 1)
                        ? 0
                        : highlightedTagIndex + 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            ArrowUp() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === 0)
                        ? this.props.tags.length - 1
                        : highlightedTagIndex - 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            Enter() {
                if (this.state.highlightedTagIndex !== undefined) {
                    this._handleTagSelection(this.props.tags[this.state.highlightedTagIndex]);
                } else {
                    this._performSearch();
                }
            },

            Tab() {
                this._handleTagSelection(this.props.tags[0]);
            },

            Escape() {
                this._resetTagSelection();

                this._handleSearchClose();
            }
        }
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);
    };

    _resetTagSelection = () => {
        this.setState({
            highlightedTagIndex: undefined
        });
    };

    _performSearch = () => {
        this._request = this.props.fetchSearch({
            query: this.props.query,
            tags: this.props.selectedTags.map((tag) => tag.id)
        });

        this._request.fetch.then(() => this.props.history.push({
                pathname: '/research',
                search: `?query=${this.props.query}`
            }));
    };

    _handleSearchClose = () => {
        this.props.history.push({
            hash: undefined
        });
    };

    render() {
        const tags = this.props.query && this.props.query.length > 0 ? this.props.tags : _.uniqBy(this.props.recentTags, (t) => t.name);
        const articles = this.props.query && this.props.query.length > 0 ? this.props.articles : _.uniqBy(this.props.recentArticles, (t) => t.title);

        return (
            <div className="search-module-results">
                {
                    this.props.isSearching &&
                    <div className="search-module-searching">
                        <Loader size="big"/>
                    </div>
                }

                <div className="search-module-container">
                    {
                        this.props.selectedTags.length > 0 &&
                        <SearchSelectedModule selectedTags={this.props.selectedTags}
                                              onTagClick={this._handleTagSelection}/>
                    }

                    <SearchTagModule tags={tags}
                                     isSearching={this.props.isSearching}
                                     selectedTags={this.props.selectedTags}
                                     highlightedTagIndex={this.state.highlightedTagIndex}
                                     onTagClick={this._handleTagSelection}/>

                    <SearchArticleModule articles={articles}
                                         isSearching={this.props.isSearching}/>

                    <button className="search-module-btn"
                            onClick={this._performSearch}>
                        {I18n.t('js.search.module.button')}
                    </button>
                </div>
            </div>
        );
    }
}
