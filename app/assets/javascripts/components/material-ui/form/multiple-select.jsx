'use strict';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const MultipleSelectFormField = ({input, label, helperText, options, meta: {touched, error}, ...custom}) => (
    <FormControl fullWidth={true}>
        <InputLabel htmlFor={input.id}>
            {label}
        </InputLabel>

        <Select multiple={true}
                input={<Input {...input}/>}
                value={input.value}
                error={touched && !!error}
                renderValue={(selected) => (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>
                        {
                            selected.map((value) => (
                                <Chip key={value}
                                      label={value}
                                      style={{
                                          margin: 2
                                      }}/>
                            ))
                        }
                    </div>
                )}
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
                    Object.keys(options).map((key) => (
                        <MenuItem key={key}
                                  value={key}>
                            {options[key]}
                        </MenuItem>
                    ))
            }
        </Select>

        <FormHelperText>
            {!!error ? error : helperText}
        </FormHelperText>
    </FormControl>
);

MultipleSelectFormField.propTypes = {
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

export default MultipleSelectFormField;
