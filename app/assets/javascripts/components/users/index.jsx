'use strict';

const UserActions = require('../../actions/userActions');
const UserStore = require('../../stores/userStore');

const UserCardDisplay = require('./display/card');

const SearchBar = require('../theme/search-bar');

const Filtering = require('../../modules/filter');

const Pagination = require('../materialize/pagination');

const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var UserIndex = React.createClass({
    propTypes: {
        onUserClick: React.PropTypes.func
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onUserChange')
    ],

    getDefaultProps () {
        return {
            onUserClick: null
        };
    },

    getInitialState () {
        return {
            users: [],
            usersPagination: null,
            filteredUsers: null
        };
    },

    componentWillMount () {
        UserActions.loadUsers({page: 1});
    },

    onUserChange (userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (typeof(userData.users) !== 'undefined') {
            newState.users = userData.users;
            newState.usersPagination = userData.meta;
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

    _handleUserClick (userId, event) {
        if (this.props.onUserClick) {
            if (event) {
                event.preventDefault();
            }

            this.props.onUserClick(userId);
        } else {
            return event;
        }
    },

    _handlePaginationClick (paginate) {
        UserActions.loadUsers({page: paginate.selected + 1});
        setTimeout(() => {
            $('html, body').animate({scrollTop: $('.blog-user-list').offset().top - 64}, 750);
        }, 300);
    },

    render () {
        let users = this.state.filteredUsers ? this.state.filteredUsers : this.state.users;

        return (
            <div className="blog-user">
                <div className="row">
                    <div className="col s12">
                        <div className="card-panel">
                            <SearchBar label={I18n.t('js.user.index.search')}
                                       onUserInput={this._handleUserInput}>
                                {this.state.filterText}
                            </SearchBar>
                        </div>
                    </div>
                </div>

                <div className="row blog-user-list">
                    <ReactCSSTransitionGroup transitionName="user"
                                             transitionAppear={true}
                                             transitionAppearTimeout={600}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        {
                            users.map((user) =>
                                <div key={user.id}
                                     className="col s6 m4 l3 ">
                                    <UserCardDisplay user={user}
                                                     onUserClick={this._handleUserClick}/>
                                </div>
                            )

                        }
                    </ReactCSSTransitionGroup>

                    {
                        this.state.usersPagination &&
                        <Pagination totalPages={this.state.usersPagination.total_pages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
});

module.exports = UserIndex;
