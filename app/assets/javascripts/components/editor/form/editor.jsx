import PropTypes from 'prop-types';

import {
    Editor
} from '@js/components/loaders/components';

import ErrorForm from '@js/components/materialize/form/error';


function EditorField({input,
                         meta: {
                             touched,
                             error
                         },
                         componentContent,
                         ...custom
                     }) {
    return (
        <>
            {
                !!(touched && error) &&
                <ErrorForm hasIcon={!!custom && !!custom.icon}>
                    {error}
                </ErrorForm>
            }

            <Editor {...input}
                    hasError={!!touched && !!error}
                    {...custom}>
                {componentContent || input.value}
            </Editor>
        </>
    );
}

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
