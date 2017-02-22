'use strict';

const ReactAutoSuggest = require('react-autosuggest');

const classNames = require('classnames');

var AutoSuggest = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        suggestionKeyValue: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        name: React.PropTypes.string,
        icon: React.PropTypes.string,
        inputId: React.PropTypes.string,
        inputName: React.PropTypes.string,
        suggestionKeyPicture: React.PropTypes.string,
        isRequired: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        suggestions: React.PropTypes.array,
        isAsync: React.PropTypes.bool,
        onFetchSuggestions: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        labelClass: React.PropTypes.string,
        children: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            name: null,
            placeholder: null,
            isRequired: false,
            isDisabled: false,
            icon: null,
            suggestionKeyPicture: null,
            suggestions: [],
            isAsync: false,
            fetchSuggestions: null,
            children: null,
            labelClass: null,
            isHorizontal: false
        };
    },

    getInitialState () {
        return {
            value: this.props.children || '',
            suggestions: this._getSuggestions(''),
            isActiveLabel: false,
            isLoading: false
        };
    },

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });

        if (this.props.isAsync) {
            this.props.onFetchSuggestions(value, (suggestions) => {
                if ($.is().isObject(suggestions)) {
                    let newSuggestions = [];
                    Object.keys(suggestions).forEach((key) => {
                        let value = suggestions[key];
                        if ($.is().isArray(value)) {
                            newSuggestions = newSuggestions.concat(value.map((suggestion) => {
                                let sg = {};
                                sg[this.props.suggestionKeyValue] = suggestion[this.props.suggestionKeyValue];
                                sg[this.props.suggestionKeyPicture] = suggestion[this.props.suggestionKeyPicture];
                                return sg;
                            }));
                        }
                    });
                    suggestions = newSuggestions;
                } else if (!$.is().isArray(suggestions)) {
                    suggestions = [];
                }

                if (value === this.state.value) {
                    this.setState({
                        isLoading: false,
                        suggestions
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        } else {
            this.setState({
                suggestions: this.props.suggestions
            });
        }
    },

    _handleSuggestionsUpdateRequested({ value }) {
        this.loadSuggestions(value);
    },

    _handleInputChange(event, { newValue }) {
        this.setState({
            value: newValue
        });

        return event;
    },

    _handleInputFocus(event) {
        this.setState({
            isActiveLabel: true
        });

        return event;
    },

    _handleInputBlur(event) {
        this.setState({
            isActiveLabel: false
        });

        return event;
    },

    _getSuggestions(value) {
        const escapedValue = value.trim().escapeRegexCharacters();

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        return this.state.suggestions.filter(suggestion => regex.test(suggestion[this.props.suggestionKeyValue]));
    },

    _getSuggestionValue(suggestion) {
        return suggestion[this.props.suggestionKeyValue];
    },

    _renderSuggestion(suggestion, {value, valueBeforeUpDown}) {
        //const suggestionText = `${suggestion.first} ${suggestion.last}`;
        //const query = (valueBeforeUpDown || value).trim();
        //const matches = AutosuggestHighlight.match(suggestionText, query);
        //const parts = AutosuggestHighlight.parse(suggestionText, matches);

        return (
            <span className="suggestion-content">
                {
                    !$.isEmpty(suggestion[this.props.suggestionKeyPicture]) &&
                    <span className="picture">
                        <img src={suggestion[this.props.suggestionKeyPicture]}
                             alt="Default picture"
                             className="activator"/>
                    </span>
                }
              <span className="name">
                {suggestion[this.props.suggestionKeyValue]}
              </span>
            </span>
        );
    },

    value () {
        return this.state.value;
    },

    collapseSuggestions () {
        this.setState({
            suggestions: []
        });
    },

    render() {
        let name = this.props.inputName;
        if (!name && this.props.inputId.indexOf('_') !== -1) {
            name = this.props.inputId.replace('_', '[') + ']';
        }

        const { value, suggestions, isLoading } = this.state;

        const inputProps = {
            placeholder: this.props.placeholder,
            value,
            name: name,
            onChange: this._handleInputChange,
            onFocus: this._handleInputFocus,
            onBlur: this._handleInputBlur
        };

        const fieldClass = classNames(
            'autosuggest',
            {
                'input-field': !this.props.isHorizontal,
                'input-horizontal-field': this.props.isHorizontal,
                'row': this.props.isHorizontal
            });

        const labelClass = classNames(
            this.props.labelClass,
            {
                active: !!this.props.placeholder || this.state.value || this.state.isActiveLabel,
                'col m3': this.props.isHorizontal
            }
        );

        const inputClass = classNames(
            'autosuggest-input-wrapper',
            {
                'col m9': this.props.isHorizontal
            }
        );

        return (
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                <label htmlFor={this.props.id}
                       className={labelClass}>
                    {this.props.label}
                </label>

                <div className={inputClass}>
                    <ReactAutoSuggest ref="autoSuggest"
                                      id={this.props.id}
                                      suggestions={suggestions}
                                      onSuggestionsUpdateRequested={this._handleSuggestionsUpdateRequested}
                                      getSuggestionValue={this._getSuggestionValue}
                                      renderSuggestion={this._renderSuggestion}
                                      inputProps={inputProps}/>
                </div>
            </div>
        );
    }
});

module.exports = AutoSuggest;
