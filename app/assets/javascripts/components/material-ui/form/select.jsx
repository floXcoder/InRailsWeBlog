import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


const SelectFormField = function ({
                                      input,
                                      label,
                                      helperText,
                                      options,
                                      meta: {
                                          touched,
                                          error
                                      },
                                      ...custom
                                  }) {
    return (
        <TextField {...input}
                   select={true}
                   label={label}
                   value={input.value}
                   error={!!touched && !!error}
                   helperText={!!error ? error : helperText}
                   {...custom}>
            {
                Array.isArray(options)
                    ?
                    options.map((key, i) => (
                        <MenuItem key={i}
                                  value={key}>
                            {key}
                        </MenuItem>
                    ))
                    :
                    Object.keys(options)
                        .map((key) => (
                            <MenuItem key={key}
                                      value={key}>
                                {options[key]}
                            </MenuItem>
                        ))
            }
        </TextField>
    );
};

SelectFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default SelectFormField;
