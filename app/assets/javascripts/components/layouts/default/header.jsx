import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import {
    Link
} from 'react-router';

import {
    LoadingBar
} from 'react-redux-loading-bar';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Button from '@mui/material/Button';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import I18n from '@js/modules/translations';

import {
    rootPath,
    searchParam
} from '@js/constants/routesHelper';

import {
    // HomeSearchHeader,
    UserSignup,
    UserLogin
} from '@js/components/loaders/components';

import {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
} from '@js/actions/uiActions';

import {
    lazyImporter,
    onPageReady
} from '@js/components/loaders/lazyLoader';

import withWidth from '@js/components/modules/mediaQuery';
import withRouter from '@js/components/modules/router';

import ErrorBoundary from '@js/components/errors/boundary';

import HeadLayout from '@js/components/layouts/head';

const HomeSearchHeader = lazyImporter(() => import(/* webpackChunkName: "header-search" */ '@js/components/layouts/header/search'));

const loadingBarStyle = {
    backgroundColor: '#036603',
    height: '2px'
};


class HeaderLayoutDefault extends React.Component {
    static propTypes = {
        searchModule: PropTypes.object.isRequired,
        // from layout
        routeProperties: PropTypes.object.isRequired,
        // from router
        routeLocation: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        metaTags: PropTypes.object,
        isUserSignupOpen: PropTypes.bool,
        isUserLoginOpen: PropTypes.bool,
        fetchMetaTags: PropTypes.func,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func,
        // from withWidth
        width: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    state = {
        isMobileOpen: false,
        // isSearchLoaded: true,
        isConnectLoaded: false
    };

    componentDidMount() {
        // Clean timestamp after connection
        if (window.location.search.includes('_=')) {
            const url = new URL(window.location);
            url.searchParams.delete('_');
            window.history.replaceState(null, null, url);
        }

        // setTimeout(() => this.setState({isSearchLoaded: true}), window.seoMode ? 20 : 200);
        if (!window.seoMode) {
            onPageReady(() => this.setState({isConnectLoaded: true}), 1000);
        }
    }

    _handleTitleClick = () => {
        this.props.fetchMetaTags('home');
    };

    _handleMobileTitleClick = () => {
        this.props.fetchMetaTags('home');

        this._handleDrawerToggle();
    };

    _handleSearchOpen = () => {
        if (this.props.routeLocation.hash !== '#search') {
            this.props.routeNavigate({
                hash: searchParam
            });
        }
    };

    _handleSearchClose = () => {
        if (this.props.routeLocation.hash === '#search') {
            this.props.routeNavigate({
                hash: undefined
            });
        }
    };

    _handleSignupClick = (event) => {
        event.preventDefault();

        this.setState({
            isConnectLoaded: true
        }, () => {
            this._handleDrawerToggle();

            this.props.showUserSignup();
        });
    };

    _handleLoginClick = (event) => {
        event.preventDefault();

        this.setState({
            isConnectLoaded: true
        }, () => {
            this._handleDrawerToggle();

            this.props.showUserLogin();
        });
    };

    _handleDrawerToggle = () => {
        this.setState((state) => ({isMobileOpen: !state.isMobileOpen}));
    };

    _renderDesktopMenu = () => {
        return (
            <div className="layout-header-section-desktop"
                 aria-label="Navigation"
                 itemScope={true}
                 itemType="https://schema.org/SiteNavigationElement">
                <Button className="layout-header-desktop-item"
                        size="small"
                        itemProp="url"
                        onClick={this._handleSignupClick}>
                    {I18n.t('js.views.header.user.sign_up')}
                </Button>

                <Button className="layout-header-desktop-item"
                        itemProp="url"
                        size="small"
                        onClick={this._handleLoginClick}>
                    {I18n.t('js.views.header.user.log_in')}
                </Button>
            </div>
        );
    };

    _renderMobileDrawer = () => {
        if (this.props.width !== 'xs' && this.props.width !== 'sm' && this.props.width !== 'md') {
            return null;
        }

        return (
            <SwipeableDrawer variant="temporary"
                             anchor="right"
                             classes={{
                                 paper: 'layout-header-mobile-drawer-paper'
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileOpen}
                             onClose={this._handleDrawerToggle}
                             onOpen={this._handleDrawerToggle}>
                <>
                    <div className="layout-header-mobile-toolbar">
                        <h5 className="layout-header-mobile-title"
                            itemProp="name">
                            <Link className="header-brand-logo-mobile"
                                  to={rootPath()}
                                  title={window.settings.website_name}
                                  itemProp="url"
                                  onClick={this._handleMobileTitleClick}>
                                {window.settings.website_name}
                            </Link>
                        </h5>
                    </div>

                    <List>
                        <ListItemButton onClick={this._handleLoginClick}>
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.log_in')}/>
                        </ListItemButton>

                        <ListItemButton onClick={this._handleSignupClick}>
                            <ListItemIcon>
                                <PersonAddIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.sign_up')}/>
                        </ListItemButton>
                    </List>
                </>
            </SwipeableDrawer>
        );
    };

    render() {
        const isSearchActive = this.props.routeLocation.hash === `#${this.props.searchModule.path}`;

        let SearchModule = null;
        if (isSearchActive) {
            SearchModule = this.props.searchModule.component();
        }

        return (
            <>
                <AppBar position="fixed"
                        className="animate-search layout-header-app-bar"
                        itemScope={true}
                        itemType="https://schema.org/Organization">
                    <LoadingBar showFastActions={true}
                                style={loadingBarStyle}/>

                    <Toolbar className="layout-header-toolbar">
                        <div>
                            <div className="layout-header-header-title"
                                 itemProp="name">
                                <Link className="header-brand-logo"
                                      to={rootPath()}
                                      title={window.settings.website_name}
                                      itemProp="url"
                                      onClick={this._handleTitleClick}>
                                    {window.settings.website_name}
                                </Link>
                            </div>
                        </div>

                        <div className="layout-header-grow"/>

                        {
                            !this.props.routeProperties.noHeaderSearch &&
                            <Suspense fallback={<div/>}>
                                <HomeSearchHeader isSearchActive={isSearchActive}
                                                  onFocus={this._handleSearchOpen}
                                                  onClose={this._handleSearchClose}/>
                            </Suspense>
                        }

                        <div className="layout-header-grow"/>

                        {this._renderDesktopMenu()}

                        <div className="layout-header-section-mobile">
                            <IconButton className="layout-header-menu-button"
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}
                                        size="large">
                                <AccountCircleIcon className="layout-header-mobile-icon"/>
                            </IconButton>
                        </div>
                    </Toolbar>

                    <div className={classNames('search-module', {
                        'is-visible': isSearchActive
                    })}>
                        {
                            !!isSearchActive &&
                            <Suspense fallback={<div/>}>
                                <ErrorBoundary errorType="notification">
                                    <SearchModule/>
                                </ErrorBoundary>
                            </Suspense>
                        }
                    </div>
                </AppBar>

                {this._renderMobileDrawer()}

                <HeadLayout>
                    {this.props.metaTags}
                </HeadLayout>

                <div id="clipboard-area"
                     className="hidden">
                <textarea id="clipboard"
                          title="clipboard"/>
                </div>

                {
                    !!this.state.isConnectLoaded &&
                    <Suspense fallback={<div/>}>
                        <ErrorBoundary errorType="notification">
                            <UserSignup isOpen={this.props.isUserSignupOpen}
                                        onModalChange={this.props.showUserSignup}/>

                            <UserLogin isOpen={this.props.isUserLoginOpen}
                                       onModalChange={this.props.showUserLogin}/>
                        </ErrorBoundary>
                    </Suspense>
                }
            </>
        );
    }
}

export default connect((state) => ({
    metaTags: state.uiState.metaTags,
    isUserSignupOpen: state.uiState.isUserSignupOpen,
    isUserLoginOpen: state.uiState.isUserLoginOpen
}), {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
})(withRouter({
    location: true,
    params: true,
    navigate: true
})(withWidth()(HeaderLayoutDefault)));
