import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';


const NumberFormField = function ({input, label, helperText, meta: {touched, error}, ...custom}) {
    return (
        <TextField {...input}
                   type="number"
                   label={label}
                   value={input.value}
                   error={!!touched && !!error}
                   helperText={!!error ? error : helperText}
                   {...custom}/>
    );
};

NumberFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default NumberFormField;
