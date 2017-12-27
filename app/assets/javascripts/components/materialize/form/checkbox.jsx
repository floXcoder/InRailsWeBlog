'use strict';

import Checkbox from '../checkbox';
import ErrorForm from './error';

const CheckBoxField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <div>
        <Checkbox {...input}
                  isDefaultChecked={!!input.value}
                  {...custom}>
            {componentContent}
        </Checkbox>

        {
            touched && error &&
            <ErrorForm>
                {error}
            </ErrorForm>
        }
    </div>
);

CheckBoxField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.bool
};

export default CheckBoxField;
