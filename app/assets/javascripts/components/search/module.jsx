'use strict';

import _ from 'lodash';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';
import UserStore from '../../stores/userStore';
import Tokenizer from '../../components/autocomplete/tokenizer';

export default class SearchModule extends Reflux.Component {
    constructor(props) {
        super(props);

        this._typeahead = null;

        this.mapStoreToState(ArticleStore, this.onArticleChange);
        this.mapStoreToState(UserStore, this.onSearchChange);
    }

    state = {
        autocompleteValues: [],
        selectedTags: [],
        previousSelectedTags: [],
        $searchDiv: null,
        suggestions: [],
        query: ''
    };

    componentDidMount() {
        Mousetrap.bind('alt+r', () => {
            this._toggleSearchNav();
            return false;
        }, 'keydown');

        $('#toggle-search').click(() => {
            this._toggleSearchNav();
            return false;
        });
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

        $searchDiv.is(":visible") ? $searchDiv.slideUp() : $searchDiv.slideDown(() => {
            $searchDiv.find('input').focus()
        });
    };

    onSearchChange(userData) {
        if (!$.isEmpty(userData.search)) {
            this._handleSubmit(null, userData.search);
        }
    }

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (!$.isEmpty(articleData.autocompletion)) {
            let autocompletionValues = [];
            let tags = [];

            articleData.autocompletion.forEach((autocompleteValue) => {
                autocompletionValues.push({entry: autocompleteValue.title, title: autocompleteValue.title});
                autocompleteValue.tags.forEach((tag) => {
                    tags.push(tag.name);
                });
            });
            _.uniq(tags, (tag) => {
                return tag.id
            }).forEach((tag) => {
                autocompletionValues.push({entry: tag, tag: tag});
            });

            newState.autocompleteValues = autocompletionValues;
        }

        if (!$.isEmpty(articleData.suggestions)) {
            newState.suggestions = articleData.suggestions;
        } else if (!$.isEmpty(this.state.suggestions)) {
            newState.suggestions = [];
        }

        if (articleData.paramsFromUrl) {
            this._activateSearch(articleData.paramsFromUrl);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

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
            ArticleActions.autocompleteArticles({autocompleteQuery: entryValue});
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

            ArticleActions.searchArticles(request);

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
            selectedTags: _.remove(this.state.selectedTags, (tag) => {
                return tag === value;
            })
        });

        this._handleSubmit(null, {tagSearch: true});
    };

    _handleCloseClick = (event) => {
        event.preventDefault();
        $('.blog-search-nav').slideUp();

        // TODO
        // this._typeahead.setEntryText('');
        this.setState({selectedTags: []});
        // this._typeahead.setState({selected: []});
    };

    render() {
        return (
            <div className="container blog-search">
                <form className="search-form"
                      onSubmit={this._handleSubmit}>
                    <Tokenizer
                        ref={(typeahead) => this._typeahead = typeahead}
                        options={this.state.autocompleteValues}
                        onKeyUp={this._onKeyUp}
                        placeholder={I18n.t('js.article.search.placeholder')}
                        filterOption="entry"
                        displayOption={this._displayOption}
                        maxVisible={6}
                        addTokenCondition="tag"
                        customClasses={{listItem: 'typeahead-list-item'}}
                        onTokenAdd={this._onTokenAdd}
                        onTokenRemove={this._onTokenRemove}/>

                    <a className="material-icons search-form-close"
                       onClick={this._handleCloseClick}
                       href="#">
                        <i className="material-icons">close</i>
                    </a>
                </form>

                <div className="blog-search-suggestion">
                    {
                        this.state.suggestions.map((suggestion) => (
                                <a key={suggestion}
                                   onClick={this._handleSuggestionClick.bind(this, suggestion)}
                                   className="waves-effect waves-light btn-small">
                                    {suggestion}
                                </a>
                            )
                        )
                    }
                </div>
            </div>
        );
    }
}
