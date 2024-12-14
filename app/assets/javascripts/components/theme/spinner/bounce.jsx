import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// import '@css/components/spinners.scss';

function BounceSpinner({className}) {
    return (
        <div className={classNames('spinner-animation', 'spinner-three-bounce', className)}>
            <div className="spinner-child spinner-bounce1"/>
            <div className="spinner-child spinner-bounce2"/>
            <div className="spinner-child spinner-bounce3"/>
        </div>
    );
}

BounceSpinner.propTypes = {
    className: PropTypes.string
};

export default React.memo(BounceSpinner);
