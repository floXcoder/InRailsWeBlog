'use strict';

import Autocomplete from '../../theme/autocomplete';


const AutocompleteFormField = function ({input, label, helperText, meta: {touched, error}, ...custom}) {
    return (
        <Autocomplete {...input}
                      label={label}
                      currentSuggestion={input.value}
                      helperText={error ?? helperText}
                      error={!!touched && !!error}
                      {...custom}/>
    );
};

AutocompleteFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    custom: PropTypes.object
};

export default AutocompleteFormField;
