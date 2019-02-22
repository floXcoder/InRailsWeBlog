'use strict';

const DoubleTimeline = ({children}) => (
    <div className="double-timeline">
        {children}
    </div>
);

DoubleTimeline.propTypes = {
    children: PropTypes.array.isRequired
};

export default React.memo(DoubleTimeline);
