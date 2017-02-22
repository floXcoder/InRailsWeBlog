'use strict';

const DoubleTimeline = ({ children }) => (
    <div className="double-timeline">
        {children}
    </div>
);

DoubleTimeline.propTypes = {
    children: React.PropTypes.array.isRequired
};

module.exports = DoubleTimeline;
