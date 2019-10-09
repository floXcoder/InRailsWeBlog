'use strict';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Chip from '@material-ui/core/Chip';

import deburr from 'lodash/deburr';

import Downshift from 'downshift';

import {
    suggestionsLimit
} from '../modules/constants';

export default class Autocomplete extends React.Component {
    static propTypes = {
        suggestions: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })).isRequired,
        currentSuggestion: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]).isRequired,
        onSuggestionChange: PropTypes.func.isRequired,
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
        isAsync: PropTypes.bool,
        isTagged: PropTypes.bool,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        helperText: PropTypes.object,
        filterValues: PropTypes.bool,
        fetchAsyncValues: PropTypes.func,
        renderSuggestion: PropTypes.func
    };

    static defaultProps = {
        inputVariant: 'outlined',
        inputMargin: 'normal',
        isMultiple: false,
        isAsync: false,
        isTagged: false,
        required: false,
        disableUnderline: false,
        filterValues: false
    };

    state = {
        value: ''
    };

    _filterData = (suggestion, inputValue) => {
        let filteredValue = String(this._getItemToKey(suggestion)).includes(inputValue);

        if (!filteredValue && this.props.filterValues) {
            const value = deburr(suggestion.value.trim().toLowerCase());
            filteredValue = value.includes(inputValue);
        }

        return filteredValue;
    };

    _getValueFromKey = (key) => {
        const allSuggestions = this.props.initialSuggestions ? this.props.initialSuggestions.concat(this.props.suggestions) : this.props.suggestions;

        const keyValue = allSuggestions.filter((suggestion) => this._getItemToKey(suggestion) === key)[0];

        return keyValue ? keyValue.value : key;
    };

    _getItemToString = (item) => {
        return item ? item.value : '';
    };

    _getItemToKey = (item) => {
        return item ? item.value : '';
    };

    _getSuggestions = (value) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        if (inputLength === 0) {
            return [];
        } else {
            return this.props.suggestions.filter((suggestion) => {
                const keep = count < suggestionsLimit && this._filterData(suggestion, inputValue);

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        }
    };

    _handelInputChange = (event) => {
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
            if (newSelectedItem.indexOf(this._getItemToKey(item)) === -1) {
                newSelectedItem = [...newSelectedItem, this._getItemToKey(item)];
            }

            this.setState({
                value: ''
            });

            this.props.onSuggestionChange(newSelectedItem);
        } else {
            this.props.onSuggestionChange(item);
        }
    };

    _handleKeyDown = (highlightedIndex, event) => {
        if (!this.props.isMultiple) {
            return event;
        }

        if (event.key === 'Backspace' && this.props.currentSuggestion.length && this.state.value.length === 0) {
            event.preventDefault();

            this.props.onSuggestionChange(this.props.currentSuggestion.slice(0, this.props.currentSuggestion.length - 1));
        } else if ((event.key === 'Enter' || event.key === 'Tab') && this.state.value.length > 0 && highlightedIndex === null) {
            event.preventDefault();

            this.setState({
                value: ''
            });

            this.props.onSuggestionChange(this.props.currentSuggestion.concat([event.target.value]));
        }
    };

    _handleDelete = (item) => () => {
        const newSelectedItem = [...this.props.currentSuggestion];
        newSelectedItem.splice(newSelectedItem.indexOf(this._getItemToKey(item)), 1);

        this.props.onSuggestionChange(newSelectedItem);
    };

    render() {
        return (
            <Downshift inputValue={this.props.isMultiple ? this.state.value : undefined}
                       initialInputValue={this.props.isMultiple ? undefined : this.props.currentSuggestion}
                       itemToString={this._getItemToString}
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
                                           onChange: this._handelInputChange
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
                                                const isSelected = (this._getItemToKey(selectedItem) || '').indexOf(this._getItemToKey(suggestion)) > -1;

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
                                                                suggestion.value
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
