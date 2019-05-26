'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import UserCardDisplay from './display/card';

import SearchBar from '../theme/searchBar';

// import Filtering from '../../modules/filter';

import Pagination from '../theme/pagination';

export default class UserIndex extends React.Component {
    static propTypes = {
        onUserClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        // UserActions.loadUsers({page: 1});

        // if (typeof(userData.users) !== 'undefined') {
        //     newState.users = userData.users;
        //     newState.usersPagination = userData.meta;
        // }
        //
        // if (!Utils.isEmpty(newState)) {
        //     this.setState(newState);
        // }
    }

    state = {
        users: [],
        usersPagination: undefined,
        filteredUsers: undefined
    };

    _handleUserInput = (filterText) => {
        // let filteredUsers = Filtering.filterArrayOfObject(this.state.users, 'pseudo', filterText);

        // this.setState({
        //     filterText: filterText,
        //     filteredUsers: filteredUsers
        // });
    };

    _handleUserClick = (userId, event) => {
        if (this.props.onUserClick) {
            if (event) {
                event.preventDefault();
            }

            this.props.onUserClick(userId);
        } else {
            return event;
        }
    };

    _handlePaginationClick = (paginate) => {
        // UserActions.loadUsers({page: paginate.selected + 1});

        setTimeout(() => {
            window.scroll({ top: $('.blog-user-list').offset().top - 64, behavior: 'smooth' });
        }, 300);
    };

    render() {
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

                <div className="blog-user-list">
                    <TransitionGroup component="div"
                                     className="row">
                        {
                            users.map((user) => (
                                <CSSTransition key={user.id}
                                               timeout={500}
                                               classNames="user">
                                    <div className="col s6 m4 l3 ">
                                        <UserCardDisplay user={user}
                                                         onUserClick={this._handleUserClick}/>
                                    </div>
                                </CSSTransition>
                            ))
                        }
                    </TransitionGroup>

                    {
                        this.state.usersPagination &&
                        <Pagination totalPages={this.state.usersPagination.total_pages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}
