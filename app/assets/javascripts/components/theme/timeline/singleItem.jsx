'use strict';

const SingleTimelineItem = ({title, currentSeparator, icon, children, date}) => (
    <li className="timeline-item">
        <div className={icon ? 'timeline-icon' : 'timeline-no-icon'}>
            {
                icon &&
                <span className="material-icons"
                      data-icon={icon}
                      aria-hidden="true"/>
            }
        </div>

        {
            date &&
            <div className="timeline-date">
                {date}
            </div>
        }

        <div className="timeline-content">
            {title}

            {
                children &&
                <div className="card-panel">
                    {children}
                </div>
            }
        </div>
    </li>
);

SingleTimelineItem.propTypes = {
    title: PropTypes.element.isRequired,
    currentSeparator: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.element,
    date: PropTypes.string
};

SingleTimelineItem.defaultProps = {
};

export default React.memo(SingleTimelineItem);
