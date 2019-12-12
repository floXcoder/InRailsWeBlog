'use strict';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBoxFormField = ({input, label, meta: {touched, error}, componentContent, ...custom}) => (
    <FormControl error={touched && !!error}
                 {...custom}>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox checked={!!input.value}
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
