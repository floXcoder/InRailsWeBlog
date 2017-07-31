'use strict';

const BounceSpinner = ({className}) => (
    <div className={classNames('spinner-animation', 'spinner-three-bounce', className)}>
        <div className="spinner-child spinner-bounce1"/>
        <div className="spinner-child spinner-bounce2"/>
        <div className="spinner-child spinner-bounce3"/>
    </div>
);

BounceSpinner.propTypes = {
    className: PropTypes.string
};

BounceSpinner.defaultProps = {
    className: null
};

export default BounceSpinner;
