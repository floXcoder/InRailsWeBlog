'use strict';

import TextField from '@mui/material/TextField';


const DateFormField = function ({input, label, helperText, meta: {touched, error}, ...custom}) {
    return (
        <TextField {...input}
                   type="date"
                   label={label}
                   value={input.value}
                   error={touched && !!error}
                   helperText={!!error ? error : helperText}
                   InputLabelProps={{
                       shrink: true
                   }}
                   {...custom}/>
    );
};

DateFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default DateFormField;
