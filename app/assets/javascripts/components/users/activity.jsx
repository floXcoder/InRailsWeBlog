'use strict';

import Pagination from '../theme/pagination';

const _handlePaginationClick = (paginate, loadActivities) => {
    loadActivities({page: paginate.selected + 1});
};

function UserActivity({activities, pagination, loadActivities}) {
    let ActivityNodes = activities.map((activity) => {
        const [model, action] = activity.key.split('.');

        let icon = 'create';
        let colorIcon = '';
        if (model === 'article') {
            icon = 'message';
            colorIcon = '';
        } else if (model === 'tag') {
            icon = 'local_offer';
            colorIcon = '';
        } else if (model === 'tagged_article') {
            icon = 'local_offer';
            colorIcon = '';
        } else if (model === 'bookmarked_article') {
            icon = 'bookmark';
            colorIcon = '';
        } else if (model === 'comment') {
            icon = 'comment';
            colorIcon = '';
        }

        return (
            <li key={activity.id}>
                <div className="activity-list-addon-element">
                    <span className={`material-icons activity-list-addon-icon ${colorIcon}`}
                          data-icon={icon}
                          aria-hidden="true"/>
                </div>
                <div className="activity-list-content">
                    <span className="activity-list-heading">
                        {I18n.t(`js.activities.${model}.${action}`)}
                    </span>

                    <span className="activity-list-date">
                        <a href={activity.link}>
                            {activity.performed_at}
                        </a>
                    </span>
                </div>
            </li>
        );
    });

    if (ActivityNodes.length === 0) {
        ActivityNodes = I18n.t('js.activities.no_activities');
    }

    return (
        <div className="user-activity">
            <ul className="activity-list activity-list-addon">
                {ActivityNodes}
            </ul>
            {
                !!pagination &&
                <Pagination totalPages={pagination.total_pages}
                            onPaginationClick={_handlePaginationClick.bind(null, loadActivities)}
                            numOfPageShow={4}/>
            }
        </div>
    );
}

UserActivity.propTypes = {
    activities: PropTypes.array,
    pagination: PropTypes.object,
    loadActivities: PropTypes.func
};

UserActivity.defaultProps = {
    activities: []
};

export default UserActivity;
