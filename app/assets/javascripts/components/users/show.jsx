'use strict';

var UserActions = require('../../actions/userActions');
var ArticleActions = require('../../actions/articleActions');
var UserStore = require('../../stores/userStore');
var ArticleStore = require('../../stores/articleStore');
var Switch = require('../../components/materialize/switch');
var Spinner = require('../../components/materialize/spinner');
var ArticleTimeline = require('../../components/articles/display/timeline');
var CommentTimeline = require('../../components/comments/display/timeline');
var UserActivity = require('../../components/users/activity');
var UserTracking = require('../../components/users/tracking');

var UserIndex = React.createClass({
    propTypes: {
        userId: React.PropTypes.number.isRequired,
        currentUserId: React.PropTypes.number.isRequired
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onUserChange'),
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    getInitialState () {
        return {
            user: null,
            userTracker: null,
            userArticles: null,
            articlesPagination: null,
            userComments: null,
            commentsPagination: null,
            userActivities: null,
            activitiesPagination: null
        };
    },

    componentWillMount () {
        UserActions.loadUsers({
            userId: this.props.userId,
            userFull: true
        });

        this._loadArticles();
        this._loadComments();
        this._loadActivities();
    },

    componentDidMount () {
        //$('.user-admin ul.tabs').tabs();
    },

    componentDidUpdate () {
        $('.user-admin ul.tabs').tabs();
    },

    _loadArticles (data) {
        let page = data ? data.page : 1;

        ArticleActions.loadArticles({
            userId: this.props.userId,
            page: page,
            summary: true
        });
    },

    _loadComments (data) {
        let page = data ? data.page : 1;

        UserActions.loadUsers({
            userId: this.props.userId,
            page: page,
            type: 'comments'
        });
    },

    _loadActivities (data) {
        let page = data ? data.page : 1;

        UserActions.loadUsers({
            userId: this.props.userId,
            page: page,
            type: 'activities'
        });
    },

    onUserChange (userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (typeof(userData.user) !== 'undefined') {
            newState.user = userData.user;
            newState.userTracker = _.omit(userData.user.tracker, 'comments_count');
            newState.userTracker.sign_in_count = userData.user.sign_in_count;
        }

        if (typeof(userData.comments) !== 'undefined') {
            newState.userComments = userData.comments;
            newState.commentsPagination = userData.meta;
        }

        if (typeof(userData['public_activity/activities']) !== 'undefined') {
            newState.userActivities = userData['public_activity/activities'];
            newState.activitiesPagination = userData.meta;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    onArticleChange (articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        if (!$.isEmpty(articleData.articles)) {
            this.setState({
                userArticles: articleData.articles,
                articlesPagination: articleData.meta
            });
        }
    },

    _onAdminChange (newAdminState) {
        UserActions.updateUser({
            id: this.state.user.id,
            admin: newAdminState,
            userFull: true
        });
    },

    _renderDropdown () {
        return (
            <ul id="dropdown-user-menu"
                className='dropdown-content'>
                <li>
                    <a>
                        {I18n.t('js.comment.modify.button')}
                    </a>
                </li>
                <li className="divider"/>
            </ul>
        );
    },

    render () {
        if ($.isEmpty(this.state.user)) {
            return null;
        }

        return (
            <div className="user-admin">
                <div className="row">
                    <div className="col s12 m8">
                        <div className="card">
                            <div className="user-heading">
                                <div className="user-heading-menu">
                                    <a className="dropdown-button tooltipped btn-flat waves-effect waves-teal"
                                       data-tooltip={I18n.t('js.user.show.more_actions')}
                                       data-activates="dropdown-user-menu">
                                        <i className="material-icons">more_vert</i>
                                    </a>
                                    {this._renderDropdown()}
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
                                                {this.state.user.tracker.comments_count}
                                                <span className="sub-heading">
                                                    {I18n.t('js.user.show.comments')}
                                                </span>
                                            </h4>
                                        </li>
                                    </ul>
                                </div>

                                <a className="user-edit-icon"
                                   href={`/admin/users_manager/${this.state.user.id}/edit`}>
                                    <i className="material-icons">mode_edit</i>
                                </a>
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
                                            this.state.userArticles ?
                                                <ArticleTimeline articles={this.state.userArticles}
                                                                 pagination={this.state.articlesPagination}
                                                                 loadArticles={this._loadArticles}/> :
                                                <Spinner spinnerClass="center-align"/>
                                        }
                                    </div>

                                    <div id="user-comments"
                                         className="col s12">
                                        {
                                            this.state.userComments ?
                                                <CommentTimeline comments={this.state.userComments}
                                                                 pagination={this.state.commentsPagination}
                                                                 loadComments={this._loadComments}/> :
                                                <Spinner spinnerClass="center-align"/>
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
                                                            <i className="activity-list-addon-icon material-icons">email</i>
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
                                                            <i className="activity-list-addon-icon material-icons">location_city</i>
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
                                                            <i className="activity-list-addon-icon material-icons">my_location</i>
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
                                                            <i className="activity-list-addon-icon material-icons">language</i>
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
                                                            <i className="activity-list-addon-icon material-icons">create</i>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.created_at &&
                                                                this.state.user.created_at.capitalize()}
                                                            </span>
                                                            <span className="activity-list-body">
                                                                {I18n.t('js.user.model.created_at').capitalize()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <i className="activity-list-addon-icon material-icons">account_box</i>
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
                                                    <li>
                                                        <div className="activity-list-addon-element">
                                                            <i className="activity-list-addon-icon material-icons">verified_user</i>
                                                        </div>
                                                        <div className="activity-list-content">
                                                            <span className="activity-list-heading">
                                                                {this.state.user.admin ?
                                                                    <span className="red-text">
                                                                        {I18n.t('js.user.show.is_admin')}
                                                                    </span> :
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
                                        this.state.userActivities ?
                                            <UserActivity activities={this.state.userActivities}
                                                          pagination={this.state.activitiesPagination}
                                                          loadActivities={this._loadActivities}/> :
                                            <Spinner spinnerClass="center-align"/>
                                    }
                                </div>
                            </div>
                        </div>

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

                        <div className="card">
                            <div className="card-content">
                                <div className="heading-3 margin-top-20 margin-bottom-20">
                                    <Switch ref="administrator"
                                            id="administrator"
                                            values={I18n.t('js.user.show.administrator')}
                                            disabled={currentUserId == this.state.user.id && this.state.user.admin}
                                            checked={this.state.user.admin}
                                            onSwitchChange={this._onAdminChange}>
                                        {I18n.t('js.user.show.admin')}
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UserIndex;
