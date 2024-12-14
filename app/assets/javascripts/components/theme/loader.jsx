import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

function Loader({
                    size,
                    className
                }) {
    return (
        <div className={classNames(
            'donut',
            size,
            className
        )}/>
    );
}

Loader.propTypes = {
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string
};

export default React.memo(Loader);

