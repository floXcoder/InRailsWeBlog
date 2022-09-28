'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import {
    headerMargin
} from '../modules/constants';

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

        this._users = React.createRef();

        this._scrollTimeout = null;

        // UserActions.loadUsers({page: 1});

        // if (typeof(userData.users) !== 'undefined') {
        //     newState.users = userData.users;
        //     newState.usersPagination = userData.meta;
        // }
        //
        // if (Utils.isPresent(newState)) {
        //     this.setState(newState);
        // }
    }

    state = {
        users: [],
        usersPagination: undefined,
        filteredUsers: undefined
    };

    componentWillUnmount() {
        if (this._scrollTimeout) {
            clearTimeout(this._scrollTimeout);
        }
    }

    _handleUserInput = () => {
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

    _handlePaginationClick = () => {
        // UserActions.loadUsers({page: paginate.selected + 1});

        this._scrollTimeout = setTimeout(() => {
            window.scroll({top: this._users.current.getBoundingClientRect().top - headerMargin, behavior: 'smooth'});
        }, 300);
    };

    render() {
        const users = this.state.filteredUsers ? this.state.filteredUsers : this.state.users;

        return (
            <div className="blog-user">
                <div className="row">
                    <div className="col s12">
                        <SearchBar label={I18n.t('js.user.index.search')}
                                   onSearchInput={this._handleUserInput}/>
                    </div>
                </div>

                <div ref={this._users}
                     className="blog-user-list">
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
                        !!this.state.usersPagination &&
                        <Pagination totalPages={this.state.usersPagination.total_pages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}
