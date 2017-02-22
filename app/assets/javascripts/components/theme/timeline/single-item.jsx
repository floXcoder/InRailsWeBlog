'use strict';

const SingleTimelineItem = (props) => (
    <div className="timeline-item">
        <div className="timeline-icon">
            <i className="material-icons">{props.icon}</i>
        </div>

        <div className="timeline-date">
            {props.date}
        </div>

        <div className="timeline-content">
            {props.title}
            <div className="card-panel">
                {props.children}
            </div>
        </div>
    </div>
);

SingleTimelineItem.propTypes = {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.element.isRequired,
    children: React.PropTypes.element.isRequired,
    date: React.PropTypes.string
};

SingleTimelineItem.defaultProps = {
    date: null
};

module.exports = SingleTimelineItem;
