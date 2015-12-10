'use strict';

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var UserStore = require('../../stores/userStore');
var Tokenizer = require('../../components/autocomplete/tokenizer');

var SearchModule = React.createClass({
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onSearchChange')
    ],

    getInitialState () {
        return {
            autocompleteValues: [],
            selectedTags: [],
            previousSelectedTags: [],
            $searchDiv: null,
            suggestions: [],
            query: ''
        };
    },

    componentDidMount () {
        Mousetrap.bind('alt+r', function () {
            this._toggleSearchNav();
            return false;
        }.bind(this), 'keydown');

        $('#toggle-search').click(function () {
            this._toggleSearchNav();
            return false;
        }.bind(this));
    },

    _activateSearch (state) {
        this._toggleSearchNav();

        if (!$.isEmpty(state.tags)) {
            state.tags.forEach(function (tag) {
                this.refs.typeahead._addTokenForValue({tag: tag}, true);
            }.bind(this));
        }

        this.refs.typeahead.setEntryText(state.query);
    },

    _toggleSearchNav () {
        let $searchDiv = $('.blog-search-nav');

        $searchDiv.is(":visible") ? $searchDiv.slideUp() : $searchDiv.slideDown(() => {
            $searchDiv.find('input').focus()
        });
    },

    onSearchChange(userStore) {
        if (!$.isEmpty(userStore.search)) {
            this._handleSubmit(null, userStore.search);
        }
    },

    onArticleChange(articleStore) {
        if ($.isEmpty(articleStore)) {
            return;
        }

        let newState = {};

        if (!$.isEmpty(articleStore.autocompletion)) {
            let autocompletionValues = [];
            let tags = [];

            articleStore.autocompletion.forEach(function (autocompleteValue) {
                autocompletionValues.push({entry: autocompleteValue.title, title: autocompleteValue.title});
                autocompleteValue.tags.forEach(function (tag) {
                    tags.push(tag.name);
                });
            });
            _.uniq(tags, function (tag) {
                return tag.id
            }).forEach(function (tag) {
                autocompletionValues.push({entry: tag, tag: tag});
            });

            newState.autocompleteValues = autocompletionValues;
        }

        if (!$.isEmpty(articleStore.suggestions)) {
            newState.suggestions = articleStore.suggestions;
        } else if (!$.isEmpty(this.state.suggestions)) {
            newState.suggestions = [];
        }

        if (articleStore.paramsFromUrl) {
            this._activateSearch(articleStore.paramsFromUrl);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleSuggestionClick (suggestion, event) {
        event.preventDefault();
        this.refs.typeahead.setEntryText(suggestion);
        this.refs.typeahead.refs.typeahead.setState({entryValue: suggestion, selection: suggestion});
        this.setState({suggestions: []});
        this._handleSubmit(event, {});
    },

    _onKeyUp (event) {
        let entryValue = this.refs.typeahead.getEntryText().trim();

        if (!$.NAVIGATION_KEYMAP.hasOwnProperty(event.which)) {
            ArticleActions.autocompleteArticles({autocompleteQuery: entryValue});
        }

        let pressedKey = $.NAVIGATION_KEYMAP[event.which];
        if (pressedKey === 'tab' || pressedKey === 'enter') {
            this.refs.typeahead.refs.typeahead.setState({entryValue: entryValue, selection: entryValue});
            this._handleSubmit(event, {});
        }
    },

    _handleSubmit (event, searchOptions) {
        if (event) {
            event.preventDefault();
        }

        if (typeof searchOptions !== 'object') {
            searchOptions = {};
        }

        let query = this.refs.typeahead.getEntryText().trim();

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

            this.state.query = query;
            this.state.previousSelectedTags = this.state.selectedTags;
            this._toggleSearchNav();
        }
    },

    _filterOption (inputValue, option) {
        if (!$.isEmpty(option.entry)) {
            let regOption = new RegExp(inputValue, 'gi');
            return option.entry.match(regOption);
        } else {
            return false;
        }
    },

    _displayOption (option) {
        if (!$.isEmpty(option.title)) {
            return (
                <div ref={option.entry}>
                    {option.title}
                </div>
            );
        } else if (!$.isEmpty(option.tag)) {
            return (
                <div ref={option.entry}>
                    {option.tag}
                    <span className="badge">Tag</span>
                </div>
            );
        } else {
            return null;
        }
    },

    _onTokenAdd (value, noSubmit) {
        if (value.tag) {
            this.state.selectedTags.push(value.tag);
        }

        if (!noSubmit) {
            this._handleSubmit(null, {tagSearch: true});
        }
    },

    _onTokenRemove(value) {
        _.remove(this.state.selectedTags, function (tag) {
            return tag === value;
        });

        this._handleSubmit(null, {tagSearch: true});
    },

    _handleCloseClick(event) {
        event.preventDefault();
        $('.blog-search-nav').slideUp();
        this.refs.typeahead.setEntryText('');
        this.setState({selectedTags: []});
        this.refs.typeahead.setState({selected: []});
    },

    render () {
        let Suggestions = this.state.suggestions.map(function (suggestion) {
            return (
                <a key={suggestion}
                   onClick={this._handleSuggestionClick.bind(this, suggestion)}
                   className="waves-effect waves-light btn-small">
                    {suggestion}
                </a>
            );
        }.bind(this));

        return (
            <div className="container blog-search">
                <form className="search-form" onSubmit={this._handleSubmit}>
                    <Tokenizer
                        ref="typeahead"
                        options={this.state.autocompleteValues}
                        onKeyUp={this._onKeyUp}
                        placeholder={I18n.t('js.article.search.placeholder')}
                        filterOption="entry"
                        displayOption={this._displayOption}
                        maxVisible={6}
                        addTokenCondition="tag"
                        customClasses={{listItem: 'typeahead-list-item'}}
                        onTokenAdd={this._onTokenAdd}
                        onTokenRemove={this._onTokenRemove}
                    />
                    <a className="material-icons search-form-close"
                       onClick={this._handleCloseClick}
                       href="#">
                        <i className="material-icons">close</i>
                    </a>
                </form>
                <div className="blog-search-suggestion">
                    {Suggestions}
                </div>
            </div>
        );
    }
});

module.exports = SearchModule;
