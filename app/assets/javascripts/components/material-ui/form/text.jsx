'use strict';

import TextField from '@mui/material/TextField';


const TextFormField = function ({input, label, helperText, meta: {touched, error}, ...custom}) {
    return (
        <TextField {...input}
                   label={label}
                   value={input.value}
                   error={!!touched && !!error}
                   helperText={!!error ? error : helperText}
                   {...custom}/>
    );
};

TextFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default TextFormField;
