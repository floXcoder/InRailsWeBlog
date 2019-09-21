'use strict';

import {
    Editor
} from '../../loaders/components';

import ErrorForm from '../../materialize/form/error';

const EditorField = ({input, meta: {touched, error}, componentContent, ...custom}) => (
    <>
        <Editor {...input}
                hasError={touched && !!error}
                {...custom}>
            {componentContent || input.value}
        </Editor>

        {
            touched && error &&
            <ErrorForm hasIcon={custom && !!custom.icon}>
                {error}
            </ErrorForm>
        }
    </>
);

EditorField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default EditorField;
