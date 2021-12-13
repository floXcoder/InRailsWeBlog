'use strict';

import {
    Suspense
} from 'react';

import {
    Link
} from 'react-router-dom';

import {
    LoadingBar
} from 'react-redux-loading-bar';

import withWidth from '@material-ui/core/withWidth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
    rootPath,
    searchParam
} from '../../../constants/routesHelper';

import {
    // HomeSearchHeader,
    UserSignup,
    UserLogin
} from '../../loaders/components';

import {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
} from '../../../actions';

import withRouter from '../../modules/router';

import ErrorBoundary from '../../errors/boundary';

import HeadLayout from '../head';

import HomeSearchHeader from '../header/search';

const loadingBarStyle = {backgroundColor: '#036603', height: '2px'};


export default @connect((state) => ({
    metaTags: state.uiState.metaTags,
    isUserSignupOpen: state.uiState.isUserSignupOpen,
    isUserLoginOpen: state.uiState.isUserLoginOpen
}), {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
})
@withWidth()
@withRouter({location: true, params: true, navigate: true})
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
            setTimeout(() => this.setState({isConnectLoaded: true}), 1000);
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
            <div className="layout-header-sectionDesktop"
                 aria-label="Navigation"
                 itemScope={true}
                 itemType="https://schema.org/SiteNavigationElement">
                <Button className="layout-header-desktopItem"
                        size="small"
                        color="default"
                        itemProp="url"
                        onClick={this._handleSignupClick}>
                    {I18n.t('js.views.header.user.sign_up')}
                </Button>

                <Button className="layout-header-desktopItem"
                        color="default"
                        itemProp="url"
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
                                 paper: 'layout-header-mobileDrawerPaper'
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileOpen}
                             onClose={this._handleDrawerToggle}
                             onOpen={this._handleDrawerToggle}>
                <>
                    <div className="layout-header-mobileToolbar">
                        <h5 className="layout-header-mobileTitle"
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
                        <ListItem button={true}
                                  onClick={this._handleLoginClick}>
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.log_in')}/>
                        </ListItem>

                        <ListItem button={true}
                                  onClick={this._handleSignupClick}>
                            <ListItemIcon>
                                <PersonAddIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.sign_up')}/>
                        </ListItem>
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
                        className="animate-search layout-header-appBar"
                        itemScope={true}
                        itemType="https://schema.org/Organization">
                    <LoadingBar showFastActions={true}
                                style={loadingBarStyle}/>

                    <Toolbar className="layout-header-toolbar">
                        <div>
                            <div className="layout-header-headerTitle"
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
                            // <Suspense fallback={<div/>}>
                            //     <ErrorBoundary errorType="notification">
                            <HomeSearchHeader isSearchActive={isSearchActive}
                                              onFocus={this._handleSearchOpen}
                                              onClose={this._handleSearchClose}/>
                            //     </ErrorBoundary>
                            // </Suspense>
                        }

                        <div className="layout-header-grow"/>

                        {this._renderDesktopMenu()}

                        <div className="layout-header-sectionMobile">
                            <IconButton className="layout-header-menuButton"
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}>
                                <AccountCircleIcon className="layout-header-mobileIcon"/>
                            </IconButton>
                        </div>
                    </Toolbar>

                    <div className={classNames('search-module', {
                        'is-visible': isSearchActive
                    })}>
                        {
                            isSearchActive &&
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
                    this.state.isConnectLoaded &&
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
