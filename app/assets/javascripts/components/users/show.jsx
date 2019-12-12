'use strict';

import {
    withStyles
} from '@material-ui/core/styles';

import UserComplete from './complete';

// import styles from '../../../jss/user/show';

export default @connect((state) => ({
    user: state.userState.user
}), {
    // fetchUser,
})
@withStyles(styles)
class UserShow extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from connect
        user: PropTypes.object,
        // from styles
        // classes: PropTypes.object
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
