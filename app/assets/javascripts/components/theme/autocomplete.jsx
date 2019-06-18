'use strict';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Chip from '@material-ui/core/Chip';

import deburr from 'lodash/deburr';

import Downshift from 'downshift';

const SUGGESTIONS_LIMIT = 8;

export default class Autocomplete extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]).isRequired,
        onChange: PropTypes.func.isRequired,
        suggestions: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })),
        inputVariant: PropTypes.string,
        helperText: PropTypes.string,
        error: PropTypes.bool,
        isMultiple: PropTypes.bool,
        isTagged: PropTypes.bool,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        filterValues: PropTypes.bool
    };

    static defaultProps = {
        suggestions: [],
        inputVariant: 'outlined',
        isMultiple: false,
        isTagged: false,
        required: false,
        filterValues: false
    };

    state = {
        value: ''
    };

    _filterData = (suggestion, inputValue) => {
        let filteredValue = suggestion.key.includes(inputValue);

        if (!filteredValue && this.props.filterValues) {
            const value = deburr(suggestion.value.trim().toLowerCase());
            filteredValue = value.includes(inputValue);
        }

        return filteredValue;
    };

    _getValueFromKey = (key) => {
        const keyValue = this.props.suggestions.filter((suggestion) => suggestion.key === key)[0];

        return keyValue ? keyValue.value : key;
    };

    _getSuggestions = (value) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        if (inputLength === 0) {
            return [];
        } else {
            return this.props.suggestions.filter((suggestion) => {
                const keep = count < SUGGESTIONS_LIMIT && this._filterData(suggestion, inputValue);

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        }
    };

    _handelInputChange = (event) => {
        if (!this.props.isMultiple) {
            return event;
        }

        this.setState({
            value: event.target.value
        });
    };

    _handleSuggestionSelected = (item) => {
        if (this.props.isMultiple) {
            let newSelectedItem = [...this.props.value];
            if (newSelectedItem.indexOf(item) === -1) {
                newSelectedItem = [...newSelectedItem, item];
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

        if (event.key === 'Backspace' && this.props.value.length && this.state.value.length === 0) {
            event.preventDefault();

            this.props.onChange(this.props.value.slice(0, this.props.value.length - 1));
        } else if ((event.key === 'Enter' || event.key === 'Tab') && this.state.value.length > 0 && highlightedIndex === null) {
            event.preventDefault();

            this.setState({
                value: ''
            });

            this.props.onChange(this.props.value.concat([event.target.value]));
        }
    };

    _handleDelete = (item) => () => {
        const newSelectedItem = [...this.props.value];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);

        this.props.onChange(newSelectedItem);
    };

    render() {
        return (
            <Downshift inputValue={this.props.isMultiple ? this.state.value : undefined}
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
                        <TextField className="field-input"
                                   variant={this.props.inputVariant}
                                   margin="normal"
                                   fullWidth={this.props.fullWidth}
                                   error={this.props.error}
                                   helperText={this.props.helperText}
                                   name={this.props.name}
                                   label={this.props.label}
                                   required={this.props.required}
                                   value={this.props.value}
                                   InputProps={{
                                       ...getInputProps({
                                           startAdornment: this.props.isMultiple ? this.props.value.map((key) => (
                                               <Chip key={key}
                                                     style={{
                                                         margin: '8px 3px'
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
                                    <Paper square={true}>
                                        {
                                            this._getSuggestions(inputValue).map((suggestion, index) => {
                                                const isHighlighted = highlightedIndex === index;
                                                const isSelected = (selectedItem || '').indexOf(suggestion.key) > -1;

                                                return (
                                                    <MenuItem {...getItemProps({item: suggestion.key})}
                                                              key={`${suggestion.key}-${index}`}
                                                              selected={isHighlighted}
                                                              component="div"
                                                              style={{
                                                                  fontWeight: isSelected ? 500 : 400
                                                              }}>
                                                        {suggestion.value}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Paper>
                                    :
                                    null
                            }
                        </div>
                    </div>
                )}
            </Downshift>
        );
    }
}
