'use strict';

import {
    Suspense
} from 'react';

import {
    withRouter,
    Route,
    Link
} from 'react-router-dom';

import {
    LoadingBar
} from 'react-redux-loading-bar';

import {
    withStyles
} from '@material-ui/core/styles';
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
    HomeSearchHeader,
    UserSignup,
    UserLogin
} from '../../loaders/components';

import {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
} from '../../../actions';

import HeadLayout from '../head';

import styles from '../../../../jss/home/header';

const loadingBarStyle = {backgroundColor: '#036603', height: '2px'};

export default @withRouter
@connect((state) => ({
    routeProperties: state.routerState.currentRoute,
    routeLocation: state.routerState.location,
    metaTags: state.uiState.metaTags,
    isUserSignupOpen: state.uiState.isUserSignupOpen,
    isUserLoginOpen: state.uiState.isUserLoginOpen
}), {
    fetchMetaTags,
    showUserSignup,
    showUserLogin
})
@withWidth()
@withStyles(styles)
class HeaderLayoutHome extends React.Component {
    static propTypes = {
        hashRoutes: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        routeProperties: PropTypes.object,
        routeLocation: PropTypes.object,
        metaTags: PropTypes.object,
        isUserSignupOpen: PropTypes.bool,
        isUserLoginOpen: PropTypes.bool,
        fetchMetaTags: PropTypes.func,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func,
        // from withWidth
        width: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isMobileOpen: false,
        isSearchLoaded: false,
        isConnectLoaded: false
    };

    componentDidMount() {
        setTimeout(() => this.setState({isSearchLoaded: true}), 200);
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
            this.props.history.push({
                hash: searchParam
            });
        }
    };

    _handleSearchClose = () => {
        if (this.props.routeLocation.hash === '#search') {
            this.props.history.push({
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

    _renderHashRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location}) => {
                       const Component = route.component();

                       return (
                           <div>
                               {
                                   location.hash === `#${route.path}` &&
                                   <Component routeParams={match.params}
                                              routeState={location.state}/>
                               }
                           </div>
                       );
                   }}/>
        ));
    };

    _renderDesktopMenu = () => {
        return (
            <div className={this.props.classes.sectionDesktop}
                 aria-label="Navigation"
                 itemScope={true}
                 itemType="https://schema.org/SiteNavigationElement">
                <Button className={this.props.classes.desktopItem}
                        size="small"
                        color="default"
                        itemProp="url"
                        onClick={this._handleSignupClick}>
                    {I18n.t('js.views.header.user.sign_up')}
                </Button>

                <Button className={this.props.classes.desktopItem}
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
            return null
        }

        return (
            <SwipeableDrawer variant="temporary"
                             anchor="right"
                             classes={{
                                 paper: this.props.classes.mobileDrawerPaper
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileOpen}
                             onClose={this._handleDrawerToggle}
                             onOpen={this._handleDrawerToggle}>
                <>
                    <div className={this.props.classes.mobileToolbar}>
                        <h5 className={this.props.classes.mobileTitle}
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
        const isSearchActive = this.props.routeLocation.hash === '#search';

        return (
            <>
                <AppBar position="fixed"
                        className={classNames('animate-search', this.props.classes.appBar)}
                        itemScope={true}
                        itemType="https://schema.org/Organization">
                    <LoadingBar showFastActions={true}
                                style={loadingBarStyle}/>

                    <Toolbar className={this.props.classes.toolbar}>
                        <div>
                            <h1 className={this.props.classes.headerTitle}
                                itemProp="name">
                                <Link className="header-brand-logo"
                                      to={rootPath()}
                                      title={window.settings.website_name}
                                      itemProp="url"
                                      onClick={this._handleTitleClick}>
                                    {window.settings.website_name}
                                </Link>
                            </h1>
                        </div>

                        <div className={this.props.classes.grow}/>

                        {
                            this.state.isSearchLoaded && !this.props.routeProperties.noHeaderSearch &&
                            <Suspense fallback={<div/>}>
                                <HomeSearchHeader isSearchActive={isSearchActive}
                                                  onFocus={this._handleSearchOpen}
                                                  onClose={this._handleSearchClose}/>
                            </Suspense>
                        }

                        <div className={this.props.classes.grow}/>

                        {this._renderDesktopMenu()}

                        <div className={this.props.classes.sectionMobile}>
                            <IconButton className={this.props.classes.menuButton}
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}>
                                <AccountCircleIcon className={this.props.classes.mobileIcon}/>
                            </IconButton>
                        </div>
                    </Toolbar>

                    <div className={classNames('search-module', {
                        'is-visible': isSearchActive
                    })}>
                        {
                            isSearchActive &&
                            <Suspense fallback={<div/>}>
                                {this._renderHashRoutes(this.props.hashRoutes.search)}
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
                        <UserSignup isOpen={this.props.isUserSignupOpen}
                                    onModalChange={this.props.showUserSignup}/>

                        <UserLogin isOpen={this.props.isUserLoginOpen}
                                   onModalChange={this.props.showUserLogin}/>
                    </Suspense>
                }
            </>
        );
    }
}
