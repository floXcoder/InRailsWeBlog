'use strict';

import _ from 'lodash';

import Tokenizer from '../autocomplete/tokenizer';

import {
    getSearchHistory,
    saveSearchHistory,
    fetchAutocomplete,
    fetchSearch
} from '../../actions';

import {
    getAutocompleteResults
} from '../../selectors';

@connect((state) => ({
    isSearching: state.searchState.isSearching,
    hasSearched: state.searchState.hasSearched,
    query: state.searchState.query,
    filters: state.searchState.filters,

    autocompleteValues: getAutocompleteResults(state)
}), {
    getSearchHistory,
    saveSearchHistory,
    fetchAutocomplete,
    fetchSearch
})
export default class SearchModule extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        // From connect
        isSearching: PropTypes.bool,
        hasSearched: PropTypes.bool,
        query: PropTypes.string,
        saveSearchHistory: PropTypes.func,
        getSearchHistory: PropTypes.func,
        fetchAutocomplete: PropTypes.func,
        fetchSearch: PropTypes.func,

        autocompleteValues: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this._typeahead = null;
    }

    state = {
        selectedTags: [],
        previousSelectedTags: [],
        $searchDiv: undefined,
        suggestions: [],
        query: ''
    };

    componentDidMount() {
        // Mousetrap.bind('alt+r', () => {
        //     this._toggleSearchNav();
        //     return false;
        // }, 'keydown');

        $('#toggle-search').click(() => {
            this._toggleSearchNav();
        });

        // this._toggleSearchNav();
    }

    _activateSearch = (state) => {
        this._toggleSearchNav();

        if (!$.isEmpty(state.tags)) {
            state.tags.forEach((tag) => {
                this._typeahead._addTokenForValue({tag: tag}, true);
            });
        }

        this._typeahead.setEntryText(state.query);
    };

    _toggleSearchNav = () => {
        let $searchDiv = $('.blog-search-nav');

        $searchDiv.is(":visible") ? $searchDiv.slideUp() : $searchDiv.slideDown(() => $searchDiv.find('input').focus());
    };

    // TODO
    // onSearchChange(searchData) {
    //     if ($.isEmpty(searchData)) {
    //         return;
    //     }
    //
    //     let newState = {};
    //
    //     // if (!$.isEmpty(searchData.suggestions)) {
    //     //     newState.suggestions = searchData.suggestions;
    //     // } else if (!$.isEmpty(this.state.suggestions)) {
    //     //     newState.suggestions = [];
    //     // }
    //
    //     // get from history
    //     // if (searchData.paramsFromUrl) {
    //     //     this._activateSearch(searchData.paramsFromUrl);
    //     // }
    //
    //     if (!$.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // }

    _handleSuggestionClick = (suggestion, event) => {
        event.preventDefault();

        this._typeahead.setEntryText(suggestion);
        this._typeahead._typeahead.setState({entryValue: suggestion, selection: suggestion});

        this.setState({suggestions: []});
        this._handleSubmit(event, {});
    };

    _onKeyUp = (event) => {
        let entryValue = this._typeahead.getEntryText().trim();

        if (!$.NAVIGATION_KEYMAP.hasOwnProperty(event.which)) {
            this.props.fetchAutocomplete({
                selectedTypes: 'all',
                query: entryValue,
                limit: 6
            });
        }

        let pressedKey = $.NAVIGATION_KEYMAP[event.which];
        if (pressedKey === 'tab' || pressedKey === 'enter') {
            this._typeahead._typeahead.setState({entryValue: entryValue, selection: entryValue});
            this._handleSubmit(event, {});
        }
    };

    _handleSubmit = (event, searchOptions) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof searchOptions !== 'object') {
            searchOptions = {};
        }

        let query = this._typeahead.getEntryText().trim();

        if ($.isEmpty(query) && !$.isEmpty(this.state.selectedTags)) {
            query = '*';
        }

        if (query === this.state.query && this.state.previousSelectedTags === this.state.selectedTags) {
            return;
        }

        if (!$.isEmpty(query)) {
            let request = {};
            request.query = query;

            if (!$.isEmpty(this.state.selectedTags)) {
                request.tags = this.state.selectedTags;
            }
            if (searchOptions) {
                request.searchOptions = searchOptions;
            }

            this.props.fetchSearch(request);

            this._toggleSearchNav();
            this.setState({
                query: query,
                previousSelectedTags: this.state.selectedTags
            });
        }
    };

    _filterOption = (inputValue, option) => {
        if (!$.isEmpty(option.entry)) {
            let regOption = new RegExp(inputValue, 'gi');
            return option.entry.match(regOption);
        } else {
            return false;
        }
    };

    _displayOption = (option) => {
        if (!$.isEmpty(option.title)) {
            return (
                <div>
                    {option.title}
                </div>
            );
        } else if (!$.isEmpty(option.tag)) {
            return (
                <div>
                    {option.tag}
                    <span className="badge">Tag</span>
                </div>
            );
        } else {
            return null;
        }
    };

    _onTokenAdd = (value, noSubmit) => {
        if (value.tag) {
            this.setState({
                selectedTags: this.state.selectedTags.concat(value.tag)
            });
        }

        if (!noSubmit) {
            this._handleSubmit(null, {tagSearch: true});
        }
    };

    _onTokenRemove = (value) => {
        this.setState({
            selectedTags: _.remove(this.state.selectedTags, (tag) => tag === value)
        });

        this._handleSubmit(null, {tagSearch: true});
    };

    _handleCloseClick = (event) => {
        event.preventDefault();
        $('.blog-search-nav').slideUp();

        this._typeahead.setEntryText('');
        this.setState({selectedTags: []});
        this._typeahead.setState({selected: []});
    };

    render() {
        return (
            <div className="container blog-search">
                <form className="search-form"
                      onSubmit={this._handleSubmit}>
                    <Tokenizer ref={(typeahead) => this._typeahead = typeahead}
                               options={this.props.autocompleteValues}
                               onKeyUp={this._onKeyUp}
                               placeholder={I18n.t('js.search.placeholder')}
                               filterOption="entry"
                               displayOption={this._displayOption}
                               maxVisible={6}
                               addTokenCondition="tag"
                               customClasses={{listItem: 'typeahead-list-item'}}
                               onTokenAdd={this._onTokenAdd}
                               onTokenRemove={this._onTokenRemove}/>

                    <a className="search-form-close"
                       onClick={this._handleCloseClick}
                       href="#">
                        <span className="material-icons"
                              data-icon="close"
                              aria-hidden="true"/>
                    </a>
                </form>

                <div className="blog-search-suggestion">
                    {
                        this.state.suggestions.map((suggestion) => (
                            <a key={suggestion}
                               onClick={this._handleSuggestionClick.bind(this, suggestion)}
                               className="btn-small waves-effect waves-light">
                                {suggestion}
                            </a>
                        ))
                    }
                </div>
            </div>
        );
    }
}
