import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


const SwitchFormField = function ({
                                      input,
                                      label,
                                      meta,
                                      componentContent,
                                      ...custom
                                  }) {
    return (
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
};

SwitchFormField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.bool
};

export default SwitchFormField;
