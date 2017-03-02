'use strict';

import ReactAutoSuggest from 'react-autosuggest';

export default class AutoSuggest extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        suggestionKeyValue: React.PropTypes.string.isRequired,
        label: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.object,
            React.PropTypes.string
        ]).isRequired,
        name: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        icon: React.PropTypes.string,
        inputId: React.PropTypes.string,
        inputName: React.PropTypes.string,
        suggestionKeyPicture: React.PropTypes.string,
        suggestionKeyIcon: React.PropTypes.string,
        isRequired: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        suggestions: React.PropTypes.array,
        minLength: React.PropTypes.number,
        limit: React.PropTypes.number,
        isAsync: React.PropTypes.bool,
        onFetchSuggestions: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        labelClass: React.PropTypes.string,
        children: React.PropTypes.string
    };

    static defaultProps = {
        name: null,
        placeholder: null,
        isRequired: false,
        isDisabled: false,
        icon: null,
        suggestionKeyPicture: null,
        suggestionKeyIcon: null,
        suggestions: [],
        minLength: 3,
        limit: 10,
        isAsync: false,
        onFetchSuggestions: null,
        children: null,
        labelClass: null,
        isHorizontal: false
    };

    state = {
        value: this.props.children || '',
        isShowingSuggestions: true,
        isActiveLabel: false,
        isLoading: false,
        suggestions: [],
    };

    constructor(props) {
        super(props);
    }

    // _getSuggestions = (value) => {
    //     const escapedValue = value.trim().escapeRegexCharacters();
    //
    //     if (escapedValue === '') {
    //         return [];
    //     }
    //
    //     const regex = new RegExp('^' + escapedValue, 'i');
    //
    //     return this.state.suggestions.filter(suggestion => regex.test(suggestion[this.props.suggestionKeyValue]));
    // }

    _handleSuggestionsFetchRequested = ({value}) => {
        this.loadSuggestions(value);
    };

    _handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    _handleInputChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });

        return event;
    };

    _handleInputFocus = (event) => {
        this.setState({
            isActiveLabel: true
        });

        return event;
    };

    _handleInputBlur = (event) => {
        this.setState({
            isActiveLabel: false
        });

        return event;
    };

    _getSuggestionValue = (suggestion) => {
        return suggestion[this.props.suggestionKeyValue];
    };

    _renderSuggestion = (suggestion, {query}) => {
        return (
            <span className="suggestion-content">
                {
                    !$.isEmpty(suggestion[this.props.suggestionKeyPicture]) &&
                    <span className="picture">
                        <img src={suggestion[this.props.suggestionKeyPicture]}
                             className="img-helper activator"/>
                    </span>
                }

                {
                    !$.isEmpty(suggestion[this.props.suggestionKeyIcon]) &&
                    <span className={classNames('suggest-icon', suggestion[this.props.suggestionKeyIcon])}/>
                }

                <span className="name">
                    {suggestion[this.props.suggestionKeyValue]}
                </span>
            </span>
        );
    };

    loadSuggestions = (value) => {
        if (value === '' || value.length < this.props.minLength) {
            return;
        }

        if (this.props.isAsync) {
            this.props.onFetchSuggestions(value, (suggestions) => {
                if ($.is().isObject(suggestions)) {
                    let newSuggestions = [];
                    Object.keys(suggestions).forEach((key) => {
                        let value = suggestions[key];
                        if ($.is().isArray(value)) {
                            newSuggestions = newSuggestions.concat(value.map((suggestion) => {
                                return {
                                    [this.props.suggestionKeyValue]: suggestion[this.props.suggestionKeyValue],
                                    [this.props.suggestionKeyPicture]: suggestion[this.props.suggestionKeyPicture],
                                    [this.props.suggestionKeyIcon]: suggestion[this.props.suggestionKeyIcon]
                                };
                            }));
                        }
                    });
                    suggestions = newSuggestions;
                } else if (!$.is().isArray(suggestions)) {
                    suggestions = [];
                }

                if (value === this.state.value && this.state.isShowingSuggestions) {
                    this.setState({
                        isShowingSuggestions: true,
                        isLoading: false,
                        suggestions: suggestions.limit(this.props.limit)
                    });
                } else {
                    this.setState({
                        isShowingSuggestions: true,
                        isLoading: false
                    });
                }
            });

            this.setState({
                isLoading: true
            });
        } else {
            this.setState({
                suggestions: this.props.suggestions,
                isLoading: true
            });
        }
    };

    value = () => {
        return this.state.value;
    };

    collapseSuggestions = () => {
        this.setState({
            suggestions: [],
            isShowingSuggestions: false
        });
    };

    render() {
        let name = this.props.inputName;
        if (!name && this.props.inputId.indexOf('_') !== -1) {
            name = this.props.inputId.replace('_', '[') + ']';
        }

        const {value, suggestions, isLoading} = this.state;

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

        const iconClass = classNames(
            'material-icons',
            'prefix',
            {
                active: !!this.props.placeholder || this.state.value || this.state.isActiveLabel
            }
        );

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
                    <i className={iconClass}>{this.props.icon}</i>
                }

                <label htmlFor={this.props.id}
                       className={labelClass}>
                    {this.props.label}
                </label>

                <div className={inputClass}>
                    <ReactAutoSuggest ref="autoSuggest"
                                      id={this.props.id}
                                      suggestions={suggestions}
                                      onSuggestionsFetchRequested={this._handleSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={this._handleSuggestionsClearRequested}
                                      getSuggestionValue={this._getSuggestionValue}
                                      renderSuggestion={this._renderSuggestion}
                                      inputProps={inputProps}/>
                </div>
            </div>
        );
    }
}

