'use strict';

import '../../../../stylesheets/components/single-timeline.scss';

const SingleTimeline = ({children}) => (
    <ul className="single-timeline">
        {children}
    </ul>
);

SingleTimeline.propTypes = {
    children: PropTypes.array.isRequired
};

export default React.memo(SingleTimeline);
