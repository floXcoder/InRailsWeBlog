'use strict';

import Selecter from '../selecter';
import ErrorForm from '../../materialize/form/error';

const SelecterField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <div>
        <Selecter {...input}
                  {...custom}>
            {componentContent}
        </Selecter>

        {
            touched && error &&
            <ErrorForm>
                {error}
            </ErrorForm>
        }
    </div>
);

SelecterField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.array
};

export default SelecterField;
