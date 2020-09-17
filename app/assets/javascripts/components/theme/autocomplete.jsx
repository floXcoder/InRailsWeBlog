'use strict';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Chip from '@material-ui/core/Chip';

import Downshift from 'downshift';

import {
    suggestionsLimit
} from '../modules/constants';

export default class Autocomplete extends React.Component {
    static propTypes = {
        currentSuggestion: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]).isRequired,
        onChange: PropTypes.func.isRequired,
        suggestions: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.shape({
                key: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired
            })),
            PropTypes.array
        ]),
        initialSuggestions: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            value: PropTypes.string
        })),
        label: PropTypes.string,
        placeholder: PropTypes.string,
        classes: PropTypes.object,
        name: PropTypes.string,
        inputVariant: PropTypes.string,
        inputMargin: PropTypes.string,
        disableUnderline: PropTypes.bool,
        isMultiple: PropTypes.bool,
        isSimpleArray: PropTypes.bool,
        isAsync: PropTypes.bool,
        isTagged: PropTypes.bool,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        helperText: PropTypes.object,
        hasFilterValues: PropTypes.bool,
        fetchAsyncValues: PropTypes.func,
        renderSuggestion: PropTypes.func
    };

    static defaultProps = {
        inputVariant: 'outlined',
        inputMargin: 'normal',
        isMultiple: false,
        isSimpleArray: false,
        isAsync: false,
        isTagged: false,
        required: false,
        disableUnderline: false,
        hasFilterValues: false
    };

    state = {
        value: ''
    };

    _filterData = (suggestion, inputValue) => {
        let filteredValue = true;

        if(this.props.hasFilterValues) {
            filteredValue = String(this._getItemKey(suggestion)).includes(inputValue);

            if (!filteredValue) {
                const value = this._getItemValue(suggestion).trim().toLowerCase();
                filteredValue = value.includes(inputValue);
            }
        }

        return filteredValue;
    };

    _getValueFromKey = (key) => {
        const allSuggestions = this.props.initialSuggestions ? this.props.initialSuggestions.concat(this.props.suggestions) : this.props.suggestions;

        if(allSuggestions) {
            const keyValue = allSuggestions.filter((suggestion) => this._getItemKey(suggestion) === key)[0];
            return this._getItemValue(keyValue);
        } else {
            return this._getItemValue(key);
        }
    };

    _getItemKey = (item) => {
        if(this.props.isSimpleArray) {
            return item;
        } else {
            return item ? item.key : '';
        }
    };

    _getItemValue = (item) => {
        if(this.props.isSimpleArray) {
            return item;
        } else {
            return item ? item.value : '';
        }
    };

    _getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        if (inputLength === 0) {
            return [];
        } else if(this.props.suggestions) {
            return this.props.suggestions.filter((suggestion) => {
                const keep = count < suggestionsLimit && this._filterData(suggestion, inputValue);

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        } else {
            return [];
        }
    };

    _handleInputChange = (event) => {
        if (this.props.isAsync) {
            this.props.fetchAsyncValues(event.target.value);
        }

        if (!this.props.isMultiple) {
            return event;
        }

        this.setState({
            value: event.target.value
        });
    };

    _handleSuggestionSelected = (item) => {
        if (this.props.isMultiple) {
            let newSelectedItem = [...this.props.currentSuggestion];
            if (newSelectedItem.indexOf(this._getItemKey(item)) === -1) {
                newSelectedItem = [...newSelectedItem, this._getItemKey(item)];
            }

            this.setState({
                value: ''
            });

            this.props.onChange(newSelectedItem);
        } else {
            this.props.onChange(item);
        }
    };

    _handleKeyDown = (highlightedIndex, event) => {
        if (!this.props.isMultiple) {
            return event;
        }

        if (event.key === 'Backspace' && this.props.currentSuggestion.length && this.state.value.length === 0) {
            event.preventDefault();

            this.props.onChange(this.props.currentSuggestion.slice(0, this.props.currentSuggestion.length - 1));
        } else if ((event.key === 'Enter' || event.key === 'Tab') && this.state.value.length > 0 && highlightedIndex === null) {
            event.preventDefault();

            this.setState({
                value: ''
            });

            this.props.onChange(this.props.currentSuggestion.concat([event.target.value]));
        }
    };

    _handleDelete = (item) => () => {
        const newSelectedItem = [...this.props.currentSuggestion];
        newSelectedItem.splice(newSelectedItem.indexOf(this._getItemKey(item)), 1);

        this.props.onChange(newSelectedItem);
    };

    render() {
        return (
            <Downshift inputValue={this.props.isMultiple ? this.state.value : undefined}
                       initialInputValue={this.props.isMultiple ? undefined : this.props.currentSuggestion}
                       itemToString={this._getItemValue}
                       onChange={this._handleSuggestionSelected}>
                {({
                      getInputProps,
                      getItemProps,
                      getMenuProps,
                      highlightedIndex,
                      inputValue,
                      isOpen,
                      selectedItem
                  }) => (
                    <div>
                        <TextField variant={this.props.inputVariant}
                                   margin={this.props.inputMargin}
                                   fullWidth={this.props.fullWidth}
                                   name={this.props.isMultiple ? undefined : this.props.name}
                                   label={this.props.label}
                                   placeholder={this.props.placeholder}
                                   helperText={this.props.helperText}
                                   required={!this.props.isMultiple && this.props.required}
                                   value={this.props.currentSuggestion}
                                   InputProps={{
                                       ...getInputProps({
                                           classes: this.props.classes,
                                           style: this.props.isMultiple ? {flexWrap: 'wrap'} : undefined,
                                           disableUnderline: this.props.disableUnderline,
                                           startAdornment: this.props.isMultiple ? this.props.currentSuggestion.map((key, i) => (
                                               <Chip key={key + '-' + i}
                                                     style={{
                                                         margin: '8px 4px'
                                                     }}
                                                     tabIndex={-1}
                                                     label={this._getValueFromKey(key)}
                                                     onDelete={this._handleDelete(key)}/>
                                           )) : undefined,
                                           onKeyDown: this.props.isMultiple ? this._handleKeyDown.bind(this, highlightedIndex) : undefined,
                                           onChange: this._handleInputChange
                                       })
                                   }}/>
                        <div {...getMenuProps()}>
                            {
                                isOpen
                                    ?
                                    <Paper style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        marginTop: 3,
                                        left: 0,
                                        right: 0
                                    }}
                                           square={true}>
                                        {
                                            this._getSuggestions(inputValue).map((suggestion, index) => {
                                                const isHighlighted = highlightedIndex === index;
                                                const isSelected = (this._getItemKey(selectedItem) || '').indexOf(this._getItemKey(suggestion)) > -1;

                                                return (
                                                    <MenuItem {...getItemProps({item: suggestion})}
                                                              key={`${suggestion.key}-${index}`}
                                                              selected={isHighlighted}
                                                              component="div"
                                                              style={{
                                                                  fontWeight: isSelected ? 500 : 400
                                                              }}>
                                                        {
                                                            this.props.renderSuggestion
                                                                ?
                                                                this.props.renderSuggestion(suggestion)
                                                                :
                                                                this._getItemValue(suggestion)
                                                        }
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Paper>
                                    :
                                    null
                            }

                            {
                                (this.props.name && this.props.isMultiple) &&
                                this.props.currentSuggestion.map((suggestion, i) => (
                                    <input key={suggestion + '-' + i}
                                           name={this.props.name + '[]'}
                                           value={suggestion}
                                           type="hidden"/>
                                ))
                            }
                        </div>
                    </div>
                )}
            </Downshift>
        );
    }
}
