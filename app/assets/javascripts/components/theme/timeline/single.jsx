import React from 'react';
import PropTypes from 'prop-types';

import '@css/components/single-timeline.scss';


function SingleTimeline({children}) {
    return (
        <ul className="single-timeline">
            {children}
        </ul>
    );
}

SingleTimeline.propTypes = {
    children: PropTypes.array.isRequired
};

export default React.memo(SingleTimeline);
