'use strict';

import Pagination from '../materialize/pagination';

const UserActivity = ({activities, pagination, loadActivities}) => {
    let ActivityNodes = activities.map((activity) => {
        let [model, action] = activity.key.split('.');

        let icon = 'create';
        let colorIcon = '';
        if (model === 'article') {
            icon = 'message';
            colorIcon = 'blue-text text-lighten-2';
        } else if (model === 'tag') {
            icon = 'local_offer';
            colorIcon = '';
        } else if (model === 'tagged_article') {
            icon = 'local_offer';
            colorIcon = '';
        } else if (model === 'bookmarked_article') {
            icon = 'bookmark';
            colorIcon = 'amber-text text-darken-1';
        } else if (model === 'comment') {
            icon = 'comment';
            colorIcon = 'red-text text-lighten-2';
        }

        return (
            <li key={activity.id}>
                <div className="activity-list-addon-element">
                    <i className={'activity-list-addon-icon material-icons ' + colorIcon}>
                        {icon}
                    </i>
                </div>
                <div className="activity-list-content">
                        <span className="activity-list-heading">
                            {I18n.t('js.activities.' + model + '.' + action)}
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
                pagination &&
                <Pagination totalPages={pagination.total_pages}
                            onPaginationClick={(paginate) => {
                                UserActivity._handlePaginationClick(paginate, loadActivities)
                            }}
                            numOfPageShow={4}/>
            }
        </div>
    );
};

UserActivity.propTypes = {
    activities: React.PropTypes.array,
    pagination: React.PropTypes.object,
    loadActivities: React.PropTypes.func
};

UserActivity.getDefaultProps = {
    activities: [],
    pagination: null,
    loadActivities: null
};

UserActivity._handlePaginationClick = (paginate, loadActivities) => {
    loadActivities({page: paginate.selected + 1});
    $('html, body').animate({scrollTop: $('.user-activity').offset().top - 64}, 750);
};

export default UserActivity;
