import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Divider from '@mui/material/Divider';

import {
    showUserLogin,
    showUserSignup
} from '@js/actions/uiActions';

import {
    lazyImporter
} from '@js/components/loaders/lazyLoader';

import LoadOnScroll from '@js/components/loaders/loadOnScroll';

import HomeBanner from '@js/components/home/banner';
import HomeSearch from '@js/components/home/search';
import HomeFunctionalities from '@js/components/home/functionalities';

import '@css/pages/default/home.scss';

const HomePopulars = lazyImporter(() => import('@js/components/home/populars'));


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

export default connect((state) => ({
    isUserConnected: state.userState.isConnected
}), {
    showUserSignup,
    showUserLogin
})(Home)