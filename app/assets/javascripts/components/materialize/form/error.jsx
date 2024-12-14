import PropTypes from 'prop-types';

import classNames from 'classnames';

function ErrorForm({
                       children,
                       hasIcon
                   }) {
    return (
        <div className={classNames('article-errors', {'with-icon': hasIcon})}>
            <p className="field-error">
                {children}
            </p>
        </div>
    );
}

ErrorForm.propTypes = {
    children: PropTypes.string.isRequired,
    hasIcon: PropTypes.bool
};

export default ErrorForm;
