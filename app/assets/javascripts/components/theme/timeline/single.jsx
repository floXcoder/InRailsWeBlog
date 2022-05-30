'use strict';

import '../../../../stylesheets/components/single-timeline.scss';

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
