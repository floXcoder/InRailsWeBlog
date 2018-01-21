'use strict';

import ReactAutoSuggest from 'react-autosuggest';

export default class AutoSuggest extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        suggestionKeyValue: PropTypes.string.isRequired,
        label: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]).isRequired,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        icon: PropTypes.string,
        inputId: PropTypes.string,
        inputName: PropTypes.string,
        suggestionKeyPicture: PropTypes.string,
        suggestionKeyIcon: PropTypes.string,
        isRequired: PropTypes.bool,
        isDisabled: PropTypes.bool,
        minLength: PropTypes.number,
        limit: PropTypes.number,
        isAsync: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        labelClass: PropTypes.string,
        value: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        onFetchSuggestions: PropTypes.func,
        onBlur: PropTypes.func
    };

    static defaultProps = {
        isRequired: false,
        isDisabled: false,
        minLength: 3,
        limit: 10,
        isAsync: false,
        isHorizontal: false,
        children: {}
    };

    constructor(props) {
        super(props);
    }

    state = {
        value: this.props.value || '',
        isActiveLabel: false
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
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

        if (this.props.onBlur) {
            this.props.onBlur(event.target.value);
        }

        return event;
    };

    _getSuggestionValue = (suggestion) => {
        return suggestion[this.props.suggestionKeyValue];
    };

    _formatResults = (suggestions) => {
        let results = [];

        if (Utils.is().isObject(suggestions)) {
            Object.keys(suggestions).forEach((key) => {
                const value = suggestions[key];
                if (Array.isArray(value)) {
                    results = results.concat(value.map((suggestion) => ({
                        [this.props.suggestionKeyValue]: suggestion[this.props.suggestionKeyValue],
                        [this.props.suggestionKeyPicture]: suggestion[this.props.suggestionKeyPicture],
                        [this.props.suggestionKeyIcon]: suggestion[this.props.suggestionKeyIcon]
                    })));
                }
            });
        } else if (Array.isArray(suggestions)) {
            results = suggestions.map((suggestion) => ({
                [this.props.suggestionKeyValue]: suggestion[this.props.suggestionKeyValue],
                [this.props.suggestionKeyPicture]: suggestion[this.props.suggestionKeyPicture],
                [this.props.suggestionKeyIcon]: suggestion[this.props.suggestionKeyIcon]
            }));
        }

        return results;
    };

    loadSuggestions = (value) => {
        if (value === '' || value.length < this.props.minLength) {
            return;
        }

        if (this.props.isAsync) {
            this.props.onFetchSuggestions(value);

            // this.setState({
            //     isLoading: true
            // });
        } else {
            // this.setState({
            //     suggestions: this.props.suggestions,
            //     isLoading: true
            // });
        }
    };

    value = () => {
        return this.state.value;
    };

    _renderSuggestion = (suggestion, {query}) => {
        return (
            <span className="suggestion-content">
                {
                    !Utils.isEmpty(suggestion[this.props.suggestionKeyPicture]) &&
                    <span className="picture">
                        <img src={suggestion[this.props.suggestionKeyPicture]}
                             className="img-helper activator"/>
                    </span>
                }

                {
                    !Utils.isEmpty(suggestion[this.props.suggestionKeyIcon]) &&
                    <span className={classNames('suggest-icon', suggestion[this.props.suggestionKeyIcon])}/>
                }

                <span className="name">
                    {suggestion[this.props.suggestionKeyValue]}
                </span>
            </span>
        );
    };

    render() {
        let name = this.props.inputName;
        if (!name && this.props.inputId.indexOf('_') !== -1) {
            name = this.props.inputId.replace('_', '[') + ']';
        }

        const inputProps = {
            placeholder: this.props.placeholder,
            value: this.state.value,
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

        const results = this._formatResults(this.props.children);

        return (
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <span className={iconClass}
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }

                <label htmlFor={this.props.id}
                       className={labelClass}>
                    {this.props.label}
                </label>

                <div className={inputClass}>
                    <ReactAutoSuggest id={this.props.id}
                                      suggestions={results.limit(this.props.limit)}
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

