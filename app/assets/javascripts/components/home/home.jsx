'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import {
    showUserLogin,
    showUserSignup
} from '../../actions';

import HomeBanner from './banner';
import HomeSearch from './search';
import HomePopulars from './populars';
import HomeFunctionalities from './functionalities';

import styles from '../../../jss/default/home';

export default @connect((state) => ({
    isUserConnected: state.userState.isConnected,
}), {
    showUserSignup,
    showUserLogin
})
@hot
@withStyles(styles)
class Home extends React.Component {
    static propTypes = {
        // from connect
        isUserConnected: PropTypes.bool,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleSignupClick = (event) => {
        event.preventDefault();

        this.props.showUserSignup();
    };

    _handleLoginClick = (event) => {
        event.preventDefault();

        this.props.showUserLogin();
    };

    render() {
        return (
            <div className={this.props.classes.home}>
                {
                    !this.props.isUserConnected &&
                    <HomeBanner classes={this.props.classes}
                                onLoginClick={this._handleLoginClick}
                                onSignupClick={this._handleSignupClick}/>
                }

                <Divider className={this.props.classes.homeDivider}/>

                <HomeSearch classes={this.props.classes}/>

                <Divider className={this.props.classes.homeDivider}/>

                <HomePopulars classes={this.props.classes}/>

                <Divider className={this.props.classes.homeDivider}/>

                <HomeFunctionalities classes={this.props.classes}
                                     onSignupClick={!this.props.isUserConnected ? this._handleSignupClick : undefined}/>
            </div>
        );
    }
}
