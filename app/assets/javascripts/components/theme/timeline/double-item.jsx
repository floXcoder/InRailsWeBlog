'use strict';

const DoubleTimelineItem = (props) => (
    <div className="timeline-block">
        <div className="timeline-icon red lighten-2 white-text">
            <i className="material-icons">{props.icon}</i>
        </div>

        <div className="card-panel timeline-content">
            {
                props.title &&
                <h4 className="timeline-date">
                    {props.title}
                </h4>
            }

            <p dangerouslySetInnerHTML={{__html: props.content}}/>

            <p className="timeline-link">
                {props.children}
            </p>

            <span className="timeline-date">
                {props.date}
            </span>
        </div>
    </div>
);

DoubleTimelineItem.propTypes = {
    date: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    children: React.PropTypes.array.isRequired,
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string
};

DoubleTimelineItem.defaultProps = {
    title: null
};

export default DoubleTimelineItem;
