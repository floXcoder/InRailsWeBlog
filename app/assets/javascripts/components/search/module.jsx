var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var UserStore = require('../../stores/userStore');
var Typeahead = require('../../components/autocomplete/typeahead');
var Tokenizer = require('../../components/autocomplete/tokenizer');

var SearchModule = React.createClass({
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onSearchChange')
    ],

    getInitialState: function () {
        return {
            autocompleteValues: [],
            selectedTags: [],
            $searchDiv: null,
            suggestions: []
        };
    },

    componentDidMount: function () {
        $('a#toggle-search').click(function () {
            //var search = $('.blog-search-nav');
            this.state.$searchDiv = $('.blog-search-nav');

            this.state.$searchDiv.is(":visible") ? this.state.$searchDiv.slideUp() : this.state.$searchDiv.slideDown(function () {
                this.state.$searchDiv.find('input').focus();
            }.bind(this));

            return false;
        }.bind(this));
    },

    onSearchChange(userStore) {
        if (!$utils.isEmpty(userStore.search)) {

            this._handleSubmit(null, userStore.search);
        }
    },

    onArticleChange(articleStore) {
        var newState = {};

        if (!$utils.isEmpty(articleStore.autocompletion)) {
            var autocompletionValues = [];
            var tags = [];

            articleStore.autocompletion.forEach(function (autocompleteValue) {
                autocompletionValues.push({entry: autocompleteValue.title, title: autocompleteValue.title});
                autocompleteValue.tags.forEach(function (tag) {
                    tags.push(tag);
                });
            });
            _.uniq(tags).forEach(function (tag) {
                autocompletionValues.push({entry: tag, tag: tag});
            });

            newState.autocompleteValues = autocompletionValues;
        }

        if (!$utils.isEmpty(articleStore.suggestions)) {
            newState.suggestions = articleStore.suggestions;
        }

        if(!$utils.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _onSuggestionClick: function (suggestion, event) {
        event.preventDefault();
        this.refs.typeahead.setEntryText(suggestion);
        this.refs.typeahead.refs.typeahead.setState({entryValue: suggestion, selection: suggestion});
        this.setState({suggestions: []});
        this._handleSubmit();
    },

    _onKeyUp: function (event) {
        var entryValue = this.refs.typeahead.getEntryText().trim();

        if (!$utils.NAVIGATION_KEYMAP.hasOwnProperty(event.which)) {
            ArticleActions.autocompleteArticles({autocompleteQuery: entryValue});
        }

        var pressedKey = $utils.NAVIGATION_KEYMAP[event.which];
        if (pressedKey === 'enter' || pressedKey === 'tab') {
            this.refs.typeahead.refs.typeahead.setState({entryValue: entryValue, selection: entryValue});

            this._handleSubmit(event);
        }
    },

    _handleSubmit: function (event, searchOptions) {
        if (event) {
            event.preventDefault();
        }

        var query = this.refs.typeahead.getEntryText().trim();
        if ($utils.isEmpty(query) && searchOptions && searchOptions.tagSearch) {
            query = '*';
        }

        if (!$utils.isEmpty(query)) {
            var request = {};
            request.query = query;

            if (!$utils.isEmpty(this.state.selectedTags)) {
                request.tags = this.state.selectedTags;
            }
            if (searchOptions) {
                request.searchOptions = searchOptions;
            }

            ArticleActions.searchArticles(request);
        }
    },

    _filterOption: function (inputValue, option) {
        if (!$utils.isEmpty(option.entry)) {
            var regOption = new RegExp(inputValue, 'gi');
            return option.entry.match(regOption);
        } else {
            return false;
        }
    },

    _displayOption: function (option) {
        if (!$utils.isEmpty(option.title)) {
            return (
                <div ref={option.entry}>
                    {option.title}
                </div>
            );
        } else if (!$utils.isEmpty(option.tag)) {
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

    _onTokenAdd: function (value) {
        if (value.tag) {
            this.state.selectedTags.push(value.tag);
        }

        this._handleSubmit(null, {tagSearch: true});
    },

    _onTokenRemove: function (value) {
        _.remove(this.state.selectedTags, function (tag) {
            return tag === value;
        });

        this._handleSubmit(null, {tagSearch: true});
    },

    _onCloseForm: function (event) {
        event.preventDefault();
        this.refs.typeahead.setEntryText('');
        this.state.$searchDiv.slideUp();
        this.setState({selectedTags: []});
        this.refs.typeahead.setState({selected: []});
    },

    render: function () {
        var Suggestions = this.state.suggestions.map(function (suggestion) {
            return (
                <a key={suggestion}
                   onClick={this._onSuggestionClick.bind(this, suggestion)}
                   className="waves-effect waves-light btn-small grey lighten-5 black-text">
                    {suggestion}
                </a>
            );
        }.bind(this));

        return (
            <div className="container blog-search">
                <form className="blog-form" onSubmit={this._handleSubmit}>
                    <Tokenizer
                        ref="typeahead"
                        options={this.state.autocompleteValues}
                        onKeyUp={this._onKeyUp}
                        placeholder={I18n.t('js.article.search.placeholder')}
                        filterOption="entry"
                        displayOption={this._displayOption}
                        maxVisible={6}
                        addTokenCondition="tag"
                        onTokenAdd={this._onTokenAdd}
                        onTokenRemove={this._onTokenRemove}
                        />
                    <a className="material-icons blog-form-close" onClick={this._onCloseForm} href="#">
                        <i className="material-icons" onClick={this._onCloseForm}>close</i>
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
