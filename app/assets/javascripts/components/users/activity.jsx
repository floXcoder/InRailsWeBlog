'use strict';

var Pagination = require('../materialize/pagination');

var UserActivity = React.createClass({
    propTypes: {
        activities: React.PropTypes.array.isRequired,
        pagination: React.PropTypes.object,
        loadActivities: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            pagination: null,
            loadActivities: null
        };
    },

    _handlePageClick (paginate) {
        this.props.loadActivities({page: paginate.selected + 1});
        $('html, body').animate({scrollTop: $('.user-activity').offset().top - 64}, 750);
    },

    render () {
        let ActivityNodes = this.props.activities.map((activity) => {
            let [model, action] = activity.key.split('.');

            let icon = 'create';
            let colorIcon = '';
            if(model === 'article') {
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

        if(ActivityNodes.length === 0) {
            ActivityNodes = I18n.t('js.activities.no_activities');
        }

        return (
            <div className="user-activity">
                <ul className="activity-list activity-list-addon">
                    {ActivityNodes}
                </ul>
                {
                    this.props.pagination &&
                    <Pagination totalPages={this.props.pagination.total_pages}
                                onPageClick={this._handlePageClick}
                                numOfPageShow={4}/>
                }
            </div>
        );
    }
});

module.exports = UserActivity;
