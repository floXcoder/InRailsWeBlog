'use strict';

import '../../../stylesheets/pages/default/home.scss';

import Divider from '@mui/material/Divider';

import {
    showUserLogin,
    showUserSignup
} from '../../actions';

import HomeBanner from './banner';
import HomeSearch from './search';
import HomePopulars from './populars';
import HomeFunctionalities from './functionalities';


export default @connect((state) => ({
    isUserConnected: state.userState.isConnected
}), {
    showUserSignup,
    showUserLogin
})
class Home extends React.Component {
    static propTypes = {
        // from connect
        isUserConnected: PropTypes.bool,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func
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
            <div className="home-home">
                {
                    !this.props.isUserConnected &&
                    <HomeBanner onLoginClick={this._handleLoginClick}
                                onSignupClick={this._handleSignupClick}/>
                }

                <Divider className="home-homeDivider"/>

                <HomeSearch/>

                <Divider className="home-homeDivider"/>

                <HomePopulars/>

                <Divider className="home-homeDivider"/>

                <HomeFunctionalities onSignupClick={!this.props.isUserConnected ? this._handleSignupClick : undefined}/>
            </div>
        );
    }
}
