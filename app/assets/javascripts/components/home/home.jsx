'use strict';

import '../../../stylesheets/pages/default/home.scss';

import Divider from '@mui/material/Divider';

import {
    showUserLogin,
    showUserSignup
} from '../../actions';

import {
    lazyImporter
} from '../loaders/lazyLoader';

import LoadOnScroll from '../loaders/loadOnScroll';

import HomeBanner from './banner';
import HomeSearch from './search';
import HomeFunctionalities from './functionalities';

const HomePopulars = lazyImporter(() => import(/* webpackChunkName: "home-populars" */ './populars'));


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

                <Divider className="home-home-divider"/>

                <HomeSearch/>

                <Divider className="home-home-divider"/>

                <LoadOnScroll dynamicImport={true}
                              offset={100}>
                    <HomePopulars/>
                </LoadOnScroll>

                <Divider className="home-home-divider"/>

                <HomeFunctionalities onSignupClick={!this.props.isUserConnected ? this._handleSignupClick : undefined}/>
            </div>
        );
    }
}
