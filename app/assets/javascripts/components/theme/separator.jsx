'use strict';

const classNames = require('classnames');

let Separator = ({ className }) => (
    <div className={classNames('separator', className)}>
        <span className="separator-h">
            <i className="material-icons">star</i>
        </span>
    </div>
);

Separator.propTypes = {
    className: React.PropTypes.string
};

Separator.defaultProps = {
    className: null
};

module.exports = Separator;
