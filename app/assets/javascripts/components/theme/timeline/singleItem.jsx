import React from 'react';
import PropTypes from 'prop-types';

function SingleTimelineItem({
                                title,
                                icon,
                                children,
                                date
                            }) {
    return (
        <li className="timeline-item">
            <div className={icon ? 'timeline-icon' : 'timeline-no-icon'}>
                {
                    !!icon &&
                    <span className="material-icons"
                          data-icon={icon}
                          aria-hidden="true"/>
                }
            </div>

            {
                !!date &&
                <div className="timeline-date">
                    {date}
                </div>
            }

            <div className="timeline-content">
                {title}

                {
                    !!children &&
                    <div className="card-panel">
                        {children}
                    </div>
                }
            </div>
        </li>
    );
}

SingleTimelineItem.propTypes = {
    title: PropTypes.element.isRequired,
    icon: PropTypes.string,
    children: PropTypes.element,
    date: PropTypes.string
};

export default React.memo(SingleTimelineItem);
