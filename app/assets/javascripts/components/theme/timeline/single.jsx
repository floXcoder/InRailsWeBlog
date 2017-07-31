'use strict';

const SingleTimeline = ({children}) => (
    <div className="single-timeline">
        {children}
    </div>
);

SingleTimeline.propTypes = {
    children: PropTypes.array.isRequired
};

export default SingleTimeline;
