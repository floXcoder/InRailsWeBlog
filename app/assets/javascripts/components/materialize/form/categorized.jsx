'use strict';

import CategorizedTag from '../categorizedTag';
import ErrorForm from './error';

function CategorizedField({input,
                              meta: {
                                  touched,
                                  error
                              },
                              componentContent,
                              ...custom
                          }) {
    return (
        <div>
            <CategorizedTag {...input}
                            {...custom}>
                {componentContent}
            </CategorizedTag>

            {
                !!(touched && error) &&
                <ErrorForm hasIcon={!!custom && !!custom.icon}>
                    {error}
                </ErrorForm>
            }
        </div>
    );
}

CategorizedField.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    custom: PropTypes.object,
    componentContent: PropTypes.array
};

export default CategorizedField;
