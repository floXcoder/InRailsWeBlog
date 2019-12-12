'use strict';

import Autocomplete from '../../theme/autocomplete';

const AutocompleteFormField = ({input, label, helperText, meta: {touched, error}, ...custom}) => (
    <Autocomplete {...input}
                  label={label}
                  value={input.value}
                  helperText={!!error ? error : helperText}
                  error={touched && !!error}
                  {...custom}/>
);

AutocompleteFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default AutocompleteFormField;
