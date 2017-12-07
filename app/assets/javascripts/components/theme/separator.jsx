'use strict';

const Separator = ({className}) => (
    <div className={classNames('separator', className)}>
        <span className="separator-h">
            <i className="material-icons">star</i>
        </span>
    </div>
);

Separator.propTypes = {
    className: PropTypes.string
};

export default Separator;
