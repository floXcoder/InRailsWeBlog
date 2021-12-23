'use strict';

// import UserComplete from './complete';

import withRouter from '../modules/router';


export default @connect((state) => ({
    user: state.userState.user
}), {
    // fetchUser,
})
@withRouter({params: true})
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
                    this.props.user &&
                    <UserComplete userId={this.props.user.id || this.props.routeParams.userPseudo}/>
                }
            </div>
        );
    }
}
