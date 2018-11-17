'use strict';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBoxForm = ({input, label, meta: {touched, error}, componentContent, ...custom}) => (
    <FormControlLabel
        control={
            <Checkbox label={label}
                      checked={!!input.value}
                      onChange={input.onChange}
                      {...custom}/>
        }
        label={label}
    />
);

CheckBoxForm.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.bool
};

export default CheckBoxForm;
