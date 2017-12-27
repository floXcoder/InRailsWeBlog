'use strict';

const Separator = ({className}) => (
    <div className={classNames('separator', className)}>
        <span className="separator-h">
            <span className="material-icons"
                  data-icon="star"
                  aria-hidden="true"/>
        </span>
    </div>
);

Separator.propTypes = {
    className: PropTypes.string
};

export default Separator;
