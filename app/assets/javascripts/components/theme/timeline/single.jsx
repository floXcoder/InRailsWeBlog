'use strict';

const SingleTimeline = ({ children }) => (
    <div className="single-timeline">
        {children}
    </div>
);

SingleTimeline.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.string
    ]).isRequired
};

module.exports = SingleTimeline;
