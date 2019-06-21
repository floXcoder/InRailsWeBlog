'use strict';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBoxFormField = ({input, label, meta: {touched, error}, componentContent, ...custom}) => (
    <FormControlLabel label={label}
                      labelPlacement="end"
                      control={
                          <Checkbox checked={!!input.value}
                                    onChange={input.onChange}
                                    {...custom}/>
                      }/>
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
