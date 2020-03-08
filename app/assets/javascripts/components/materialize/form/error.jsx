'use strict';

const ErrorForm = ({children, hasIcon}) => (
    <ul className={classNames('field-errors filled', {'with-icon': hasIcon})}>
        <li className="field-error">
            {children}
        </li>
    </ul>
);

ErrorForm.propTypes = {
    children: PropTypes.string.isRequired,
    hasIcon: PropTypes.bool
};

export default ErrorForm;
