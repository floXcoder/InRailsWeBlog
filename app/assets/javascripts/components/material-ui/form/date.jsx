'use strict';

import TextField from '@material-ui/core/TextField';

const DateFormField = ({input, label, helperText, meta: {touched, error}, ...custom}) => (
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

DateFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default DateFormField;
