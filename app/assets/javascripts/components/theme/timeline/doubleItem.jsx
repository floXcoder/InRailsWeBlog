'use strict';

const DoubleTimelineItem = (props) => (
    <div className="timeline-block">
        <div className="timeline-icon">
            <span className="material-icons"
                  data-icon={props.icon}
                  aria-hidden="true"/>
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
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string
};

export default React.memo(DoubleTimelineItem);
