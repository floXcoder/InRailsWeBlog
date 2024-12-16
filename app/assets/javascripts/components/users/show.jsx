import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

// import UserComplete from '@js/components/users/complete';

import withRouter from '@js/components/modules/router';


class UserShow extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        // from connect
        user: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    !!this.props.user &&
                    <UserComplete userId={this.props.user.id || this.props.routeParams.userPseudo}/>
                }
            </div>
        );
    }
}

export default connect((state) => ({
    user: state.userState.user
}), {
    // fetchUser,
})(withRouter({params: true})(UserShow));
