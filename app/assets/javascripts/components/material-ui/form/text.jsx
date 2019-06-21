'use strict';

import TextField from '@material-ui/core/TextField';

const TextFormField = ({input, label, helperText, meta: {touched, error}, ...custom}) => (
    <TextField {...input}
               label={label}
               value={input.value}
               error={touched && !!error}
               helperText={!!error ? error : helperText}
               {...custom}/>
);

TextFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default TextFormField;
