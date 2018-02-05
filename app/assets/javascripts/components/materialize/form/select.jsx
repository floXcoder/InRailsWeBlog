'use strict';

import Select from '../select';
import ErrorForm from './error';

const SelectField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <div>
        <Select {...input}
                {...custom}>
            {componentContent}
        </Select>

        {
            touched && error &&
            <ErrorForm>
                {error}
            </ErrorForm>
        }
    </div>
);

SelectField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.string
};

export default SelectField;
