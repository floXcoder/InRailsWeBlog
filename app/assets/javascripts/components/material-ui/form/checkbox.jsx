import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';


const CheckBoxFormField = function ({
                                        input,
                                        label,
                                        meta: {
                                            touched,
                                            error
                                        },
                                        componentContent,
                                        ...custom
                                    }) {
    return (
        <FormControl error={!!touched && !!error}
                     {...custom}>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={!!input.checked}
                                                     required={custom.required}
                                                     {...input}/>}
                                  label={label}
                                  labelPlacement="end"/>
            </FormGroup>
            {
                !!error &&
                <FormHelperText>{error}</FormHelperText>
            }
        </FormControl>
    );
};

CheckBoxFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.bool
};

export default CheckBoxFormField;
