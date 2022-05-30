'use strict';

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
