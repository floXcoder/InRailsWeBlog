import React from 'react';
import PropTypes from 'prop-types';

function DoubleTimeline({children}) {
    return (
        <div className="double-timeline">
            {children}
        </div>
    );
}

DoubleTimeline.propTypes = {
    children: PropTypes.array.isRequired
};

export default React.memo(DoubleTimeline);
