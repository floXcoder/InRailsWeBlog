'use strict';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwitchFormField = ({input, label, meta, componentContent, ...custom}) => (
    <FormControl component="fieldset">
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch {...input}
                            checked={!!input.value}
                            {...custom}/>
                }
                label={label}
            />
        </FormGroup>
    </FormControl>
);

SwitchFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.bool
};

export default SwitchFormField;
