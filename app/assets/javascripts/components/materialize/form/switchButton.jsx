'use strict';

import SwitchButton from '../switchButton';
import ErrorForm from './error';

const SwitchButtonField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <div>
        <SwitchButton {...input}
                      {...custom}>
            {componentContent}
        </SwitchButton>

        {
            touched && error &&
            <ErrorForm>
                {error}
            </ErrorForm>
        }
    </div>
);

SwitchButtonField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ])
};

export default SwitchButtonField;
