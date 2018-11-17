'use strict';

import {
    withRouter,
    Route,
    Link
} from 'react-router-dom';

import {
    ImmutableLoadingBar as LoadingBar
} from 'react-redux-loading-bar';

import {
    withStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
    showUserSignup,
    showUserLogin
} from '../../../actions';

import Login from '../../users/login';
import Signup from '../../users/signup';

import HomeSearchHeader from '../header/search';

import styles from '../../../../jss/home/header';

export default @withRouter

@connect((state) => ({
    isUserSignupOpen: state.uiState.isUserSignupOpen,
    isUserLoginOpen: state.uiState.isUserLoginOpen,
    isSearchPopupOpen: state.uiState.isSearchPopupOpen
}), {
    showUserSignup,
    showUserLogin
})
@withStyles(styles)
class HeaderLayoutHome extends React.Component {
    static propTypes = {
        permanentRoutes: PropTypes.array.isRequired,
        // from router
        location: PropTypes.object,
        history: PropTypes.object,
        // from connect
        isUserSignupOpen: PropTypes.bool,
        isUserLoginOpen: PropTypes.bool,
        isSearchPopupOpen: PropTypes.bool,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isMobileOpen: false
    };

    componentDidMount() {
        $(document).keyup((event) => {
            if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                this._handleSearchClose();
            }
        });
    }

    _handleSearchOpen = () => {
        if (this.props.location.hash !== '#search') {
            this.props.history.push({
                hash: 'search'
            });
        }
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    _handleSignupClick = (event) => {
        event.preventDefault();

        this._handleDrawerToggle();

        this.props.showUserSignup();
    };

    _handleLoginClick = (event) => {
        event.preventDefault();

        this._handleDrawerToggle();

        this.props.showUserLogin();
    };

    _handleDrawerToggle = () => {
        this.setState(state => ({isMobileOpen: !state.isMobileOpen}));
    };

    _renderPermanentRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location, history}) => {
                       const Component = route.component();

                       return (
                           <div>
                               {
                                   location.hash === `#${route.path}` &&
                                   <Component params={match.params}
                                              history={history}
                                              initialData={location.state}/>
                               }
                           </div>
                       );
                   }}/>
        ));
    };

    _renderDesktopMenu = () => {
        return (
            <div className={this.props.classes.sectionDesktop}>
                <Button color="primary"
                        onClick={this._handleSignupClick}>
                    {I18n.t('js.views.header.user.sign_up')}
                </Button>

                <Button color="primary"
                        onClick={this._handleLoginClick}>
                    {I18n.t('js.views.header.user.log_in')}
                </Button>
            </div>
        );
    };

    _renderMobileDrawer = () => {
        return (
            <Hidden mdUp={true}>
                <SwipeableDrawer variant="temporary"
                                 anchor="left"
                                 classes={{
                                     paper: this.props.classes.mobileDrawerPaper
                                 }}
                                 ModalProps={{
                                     keepMounted: true
                                 }}
                                 open={this.state.isMobileOpen}
                                 onClose={this._handleDrawerToggle}
                                 onOpen={this._handleDrawerToggle}>
                    <div>
                        <div className={this.props.classes.mobileToolbar}>
                            <Link to="/">
                                <Typography variant="h5">
                                    {I18n.t('js.views.header.title')}
                                </Typography>
                            </Link>
                        </div>

                        <List>
                            <ListItem button={true}
                                      onClick={this._handleSignupClick}>
                                <ListItemIcon>
                                    <PersonAddIcon/>
                                </ListItemIcon>
                                <ListItemText primary={I18n.t('js.views.header.user.sign_up')}/>
                            </ListItem>

                            <ListItem button={true}
                                      onClick={this._handleLoginClick}>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText primary={I18n.t('js.views.header.user.log_in')}/>
                            </ListItem>
                        </List>
                    </div>
                </SwipeableDrawer>
            </Hidden>
        );
    };

    render() {
        const isSearchActive = this.props.location.hash === '#search';

        return (
            <>
                <AppBar position="fixed"
                        className={classNames('animate-search', this.props.classes.appBar)}>
                    <LoadingBar showFastActions={true}
                                style={{backgroundColor: '#233348', height: '2px'}}/>

                    <Toolbar className={classNames(this.props.classes.toolbar)}>
                        <div className={this.props.classes.sectionDesktop}>
                            <Link className={this.props.classes.title}
                                  to="/">
                                <Typography variant="h5">
                                    {I18n.t('js.views.header.title')}
                                </Typography>
                            </Link>
                        </div>

                        <div className={this.props.classes.sectionMobile}>
                            <IconButton className={this.props.classes.menuButton}
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>

                            <Link className={this.props.classes.title}
                                  to="/">
                                <Typography variant="h5">
                                    InR
                                </Typography>
                            </Link>

                        </div>

                        <div className={this.props.classes.grow}/>

                        <HomeSearchHeader isSearchActive={isSearchActive}
                                          onFocus={this._handleSearchOpen}
                                          onClose={this._handleSearchClose}/>

                        <div className={this.props.classes.grow}/>

                        {this._renderDesktopMenu()}
                    </Toolbar>

                    <div className={classNames('search-module', {
                        'is-visible': isSearchActive
                    })}>
                        {
                            isSearchActive &&
                            this._renderPermanentRoutes(this.props.permanentRoutes)
                        }
                    </div>
                </AppBar>

                {this._renderMobileDrawer()}

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                <Signup isOpen={this.props.isUserSignupOpen}
                        onModalChange={this.props.showUserSignup}/>

                <Login isOpen={this.props.isUserLoginOpen}
                       onModalChange={this.props.showUserLogin}/>
            </>
        );
    }
}
