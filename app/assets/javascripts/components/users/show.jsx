'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    getUser,
} from '../../selectors';

import UserComplete from './complete';

// import styles from '../../../jss/user/show';

export default @connect((state) => ({
    isUserConnected: state.userState.isConnected,
    isFetching: state.userState.isFetching,
    user: getUser(state)
}), {
    // fetchUser,
})
@withStyles(styles)
class UserShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // from connect
        isUserConnected: PropTypes.bool,
        isFetching: PropTypes.bool,
        user: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.user &&
                    <UserComplete userId={this.props.userId || this.props.params.userPseudo}/>
                }
            </div>
        );
    }
}
