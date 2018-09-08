'use strict';

import _ from 'lodash';

import {
    Link
} from 'react-router-dom';


import ArticleTimelineDisplay from '../articles/display/timeline';

import CommentTimeline from '../comments/display/timeline';

import UserActivity from '../users/activity';
import UserTracking from '../users/tracking';

import SwitchButton from '../materialize/switchButton';
import Loader from '../theme/loader';

export default @connect((state) => ({
    isAdminConnected: state.adminState.isConnected
}))
class UserComplete extends React.Component {
    static propTypes = {
        userId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        // From connect
        isAdminConnected: PropTypes.bool
    };

    static defaultProps = {
        isAdminConnected: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        user: {},
        userTracker: null,
        userArticles: null,
        articlesPagination: null,
        userComments: null,
        commentsPagination: null,
        userActivities: null,
        activitiesPagination: null
    };

    componentDidMount() {
        // UserActions.loadUser({
        //     userId: props.userId,
        //     completeUser: true
        // });

        this._loadArticles(this.props.userId);
        this._loadComments(this.props.userId);
        this._loadActivities(this.props.userId);
    }

    componentDidUpdate() {
        $('.user-admin ul.tabs').tabs();
    }

    _loadArticles = (userId, data = {}) => {
        // ArticleActions.loadArticles({
        //     userId: userId,
        //     page: data.page || 1,
        //     summary: true
        // });
    };

    _loadComments = (userId, data = {}) => {
        // UserActions.loadUserComments(userId, {
        //     page: data.page || 1
        // });
    };

    _loadActivities = (userId, data = {}) => {
        // UserActions.loadUserActivities(userId, {
        //     page: data.page || 1
        // });
    };

    onUserChange(userData) {
        if (Utils.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (userData.type === 'loadUser') {
            newState.user = userData.user;
            newState.userTracker = _.omit(userData.user.tracker, 'comments_count');
            newState.userTracker.sign_in_count = userData.user.sign_in_count;
        }

        if (userData.type === 'loadUserComments') {
            newState.userComments = userData.comments;
            newState.commentsPagination = userData.pagination;
        }

        if (userData.type === 'loadUserActivities') {
            newState.userActivities = userData.activities;
            newState.activitiesPagination = userData.pagination;
        }

        if (!Utils.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    onArticleChange(articleData) {
        if (Utils.isEmpty(articleData)) {
            return;
        }

        if (articleData.type === 'loadArticles') {
            this.setState({
                userArticles: articleData.articles,
                articlesPagination: articleData.pagination
            });
        }
    }

    _onAdminChange = (newAdminState) => {
        if (this.props.isAdminConnected) {
            // UserActions.updateUser({
            //     id: this.state.user.id,
            //     admin: newAdminState,
            //     completeUser: true
            // });
        }
    };

    render() {
        return (
            <div className="user-admin">
                <div className="row">
                    <div className="col s12 m8">
                        <div className="card">
                            <div className="user-heading">
                                <div className="user-heading-menu">
                                    <a className="btn-flat waves-effect waves-teal tooltip-bottom dropdown-button"
                                       data-tooltip={I18n.t('js.user.show.more_actions')}
                                       data-activates="dropdown-user-menu">
                                        <span className="material-icons"
                                              data-icon="more_vert"
                                              aria-hidden="true"/>
                                    </a>

                                    <ul id="dropdown-user-menu"
                                        className='dropdown-content'>
                                        <li>
                                            <Link to={`/user/profile/${this.props.userId}/edit`}>
                                                {I18n.t('js.user.show.edit')}
                                            </Link>
                                        </li>
                                        <li className="divider"/>
                                    </ul>
                                </div>

                                <div className="user-heading-avatar">
                                    <div className="thumbnail">
                                        <img src={this.state.user.avatar}
                                             className="circle responsive-img"
                                             alt="User avatar"/>
                                    </div>
                                </div>

                                <div className="user-heading-content">
                                    <h2 className="heading-2">
                                        {this.state.user.pseudo}
                                        <span className="sub-heading">
                                            {`${this.state.user.first_name} ${this.state.user.last_name}`}
                                        </span>
                                    </h2>

                                    <ul className="user-stats">
                                        <li>
                                            <h4 className="heading-1">
                                                {this.state.user.articles_count}
                                                <span className="sub-heading">
                                                    {I18n.t('js.user.show.articles')}
                                                </span>
                                            </h4>
                                        </li>

                                        <li>
                                            <h4 className="heading-1">
                                                {this.state.user.tracker && this.state.user.tracker.comments_count}
                                                <span className="sub-heading">
                                                    {I18n.t('js.user.show.comments')}
                                                </span>
                                            </h4>
                                        </li>
                                    </ul>
                                </div>

                                <Link className="user-edit-icon"
                                      to={`/user/profile/${this.props.userId}/edit`}>
                                    <span className="material-icons"
                                          data-icon="mode_edit"
                                          aria-hidden="true"/>
                                </Link>
                            </div>

                            <div className="card-content user-content">
                                <div className="row">
                                    <div className="col s12 margin-bottom-20">
                                        <ul className="tabs">
                                            <li className="tab col s4">
                                                <a className="active"
                                                   href="#user-articles">
                                                    {I18n.t('js.user.show.articles')}
                                                </a>
                                            </li>
                                            <li className="tab col s4">
                                                <a href="#user-comments">
                                                    {I18n.t('js.user.show.comments')}
                                                </a>
                                            </li>
                                            <li className="tab col s4">
                                                <a href="#user-about">
                                                    {I18n.t('js.user.show.about')}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div id="user-articles"
                                         className="col s12">
                                        {
                                            this.state.userArticles
                                                ?
                                                <ArticleTimelineDisplay articles={this.state.userArticles}
                                                                        pagination={this.state.articlesPagination}
                                                                        loadArticles={this._loadArticles}/>
                                                :
                                                <Loader/>
                                        }
                                    </div>

                                    <div id="user-comments"
                                         className="col s12">
                                        {
                                            this.state.userComments
                                                ?
                                                <CommentTimeline comments={this.state.userComments}
                                                                 pagination={this.state.commentsPagination}
                                                                 loadComments={this._loadComments}/>
                                                :
                                                <Loader/>
                                        }
                                    </div>

                                    <div id="user-about"
                                         className="col s12">
                                        <div className="margin-bottom-20">
                                            {this.state.user.additional_info}
                                        </div>


                                        <div className="row user-activity">
                                            <div className="col s12 m6">
                                                <h4 className="heading-3">
                                                    {I18n.t('js.user.show.contact')}
                                                </h4>
                                                <ul className="activity-list activity-list-addon">
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="email"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.email}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.email').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="location_city"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.city}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.city').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="my_location"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.country}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.country').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="language"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.locale}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.locale').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="col s12 m6">
                                                <h4 className="heading-3">
                                                    {I18n.t('js.user.show.properties')}
                                                </h4>
                                                <ul className="activity-list activity-list-addon">
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="create"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {
                                                                    this.state.user.created_at &&
                                                                    this.state.user.created_at.capitalize()
                                                                }
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.created_at').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <span className="material-icons activity-list-addon-icon"
                                                                  data-icon="account_box"
                                                                  aria-hidden="true"/>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.last_sign_in_at && this.state.user.last_sign_in_at.capitalize()}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.last_sign_in_at').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>

                                                    {
                                                        this.props.isAdminConnected &&
                                                        <li>
                                                            <div className="activity-list-addon-element">
                                                                <span
                                                                    className="material-icons activity-list-addon-icon"
                                                                    data-icon="verified_user"
                                                                    aria-hidden="true"/>
                                                            </div>
                                                            <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {
                                                                    this.state.user.admin ?
                                                                        <span className="">
                                                                            {I18n.t('js.user.show.is_admin')}
                                                                        </span>
                                                                        :
                                                                        <span>
                                                                            {I18n.t('js.user.show.not_admin')}
                                                                        </span>
                                                                }
                                                            </span>
                                                                <span className="activity-list-body">
                                                                {I18n.t('js.user.model.admin').capitalize()}
                                                            </span>
                                                            </div>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m4">
                        <div className="card">
                            <div className="card-content">
                                <div>
                                    <h3 className="heading-3">
                                        {I18n.t('js.user.show.activities')}
                                    </h3>
                                    {
                                        this.state.userActivities
                                            ?
                                            <UserActivity activities={this.state.userActivities}
                                                          pagination={this.state.activitiesPagination}
                                                          loadActivities={this._loadActivities}/>
                                            :
                                            <Loader/>
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            this.props.isAdminConnected &&
                            <div className="card">
                                <div className="card-content">
                                    <div>
                                        <h3 className="heading-3 margin-top-20">
                                            {I18n.t('js.user.model.additional_info')}
                                        </h3>
                                        {
                                            this.state.userTracker &&
                                            <UserTracking tracking={this.state.userTracker}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            this.props.isAdminConnected &&
                            <div className="card">
                                <div className="card-content">
                                    <div className="heading-3 margin-top-20 margin-bottom-20">
                                        <SwitchButton id="administrator"
                                                      values={I18n.t('js.user.show.administrator')}
                                                      title={I18n.t('js.user.show.admin')}
                                                      onSwitchChange={this._onAdminChange}>
                                            {this.state.user.admin}
                                        </SwitchButton>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
