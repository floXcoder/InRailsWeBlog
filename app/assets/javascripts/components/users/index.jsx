'use strict';

var UserActions = require('../../actions/userActions');
var UserStore = require('../../stores/userStore');

var UserCardDisplay = require('./display/card');

var SearchBar = require('../theme/search-bar');

var Filtering = require('../../modules/filter');

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var UserIndex = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onUserChange')
    ],

    getInitialState () {
        return {
            users: [],
            filteredUsers: null
        };
    },

    componentWillMount () {
        UserActions.loadUsers();
    },

    componentDidMount () {
    },

    onUserChange (userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (typeof(userData.users) !== 'undefined') {
            newState.users = userData.users;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleUserInput (filterText) {
        let filteredUsers = Filtering.filterArrayOfObject(this.state.users, 'pseudo', filterText);

        this.setState({
            filterText: filterText,
            filteredUsers: filteredUsers
        });
    },

    render () {
        let users = this.state.filteredUsers ? this.state.filteredUsers : this.state.users;

        let UserList = users.map((user) => {

            return (
                <div key={user.id}
                     className="col s6 m4 l3 ">
                    <UserCardDisplay
                        user={user}/>
                </div>

            );
        });

        return (
            <div className="blog-user">
                <h1 className="heading-2 center-align">
                    {I18n.t('js.admin.users.index.title')}
                </h1>

                <div className="row">
                    <div className="col s12">
                        <div className="card-panel">
                            <SearchBar label={I18n.t('js.user.index.search')}
                                       filterText={this.state.filterText}
                                       onUserInput={this._handleUserInput}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <ReactCSSTransitionGroup transitionName="user"
                                             transitionAppear={true}
                                             transitionAppearTimeout={600}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        {UserList}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
});

module.exports = UserIndex;
