import React from 'react';
import PropTypes from 'prop-types';

const DoubleTimelineItem = function ({date, content, children, icon, title}) {
    return (
        <div className="timeline-block">
            <div className="timeline-icon">
            <span className="material-icons"
                  data-icon={icon}
                  aria-hidden="true"/>
            </div>

            <div className="card-panel timeline-content">
                {
                    !!title &&
                    <h4 className="timeline-date">
                        {title}
                    </h4>
                }

                <p dangerouslySetInnerHTML={{__html: content}}/>

                <p className="timeline-link">
                    {children}
                </p>

                <span className="timeline-date">
                    {date}
                </span>
            </div>
        </div>
    );
};

DoubleTimelineItem.propTypes = {
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string
};

export default React.memo(DoubleTimelineItem);
