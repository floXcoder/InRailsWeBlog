'use strict';

import Input from '../input';
import ErrorForm from './error';

const TextField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <div>
        <Input {...input}
               hasError={touched && !!error}
               {...custom}>
            {componentContent}
        </Input>

        {
            touched && error &&
            <ErrorForm hasIcon={custom && !!custom.icon}>
                {error}
            </ErrorForm>
        }
    </div>
);

TextField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default TextField;
