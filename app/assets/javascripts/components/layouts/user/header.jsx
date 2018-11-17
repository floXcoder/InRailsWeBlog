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
import Popover from '@material-ui/core/Popover';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ClassIcon from '@material-ui/icons/Class';

import {
    getLocalData
} from '../../../middlewares/localStorage';

import {
    showUserSignup,
    showUserLogin,
    showUserPreference,
    showTopicPopup
} from '../../../actions';

import {
    getCurrentTagSlugs
} from '../../../selectors';

import Login from '../../users/login';
import Signup from '../../users/signup';
import Preference from '../../users/preference';

import TopicModule from '../../topics/module';

import BookmarkList from '../../bookmark/list';

import TagSidebar from '../../tags/sidebar';

import HomeSearchHeader from '../header/search';
import HomeBookmarkHeader from '../header/bookmark';
import HomeArticleHeader from '../header/article';
import HomeUserHeader from '../header/user';

import HeaderUserMenu from '../header/menus/user';
import HeaderArticleMenu from '../header/menus/article';

import styles from '../../../../jss/user/header';

export default @withRouter

@connect((state) => ({
    isUserSignupOpen: state.uiState.isUserSignupOpen,
    isUserLoginOpen: state.uiState.isUserLoginOpen,
    isUserPreferenceOpen: state.uiState.isUserPreferenceOpen,
    isTopicPopupOpen: state.uiState.isTopicPopupOpen,
    isUserConnected: state.userState.isConnected,
    isUserLoaded: state.userState.isLoaded,
    isAdminConnected: state.userState.isAdminConnected,
    userSlug: state.userState.currentSlug,
    topicSlug: state.topicState.currentUserTopicSlug,
    currentTopic: state.topicState.currentTopic,
    currentTagSlugs: getCurrentTagSlugs(state)
}), {
    showUserSignup,
    showUserLogin,
    showUserPreference,
    showTopicPopup
})

@withStyles(styles)
class HeaderLayoutUser extends React.PureComponent {
    static propTypes = {
        permanentRoutes: PropTypes.array.isRequired,
        // from router
        location: PropTypes.object,
        match: PropTypes.object,
        history: PropTypes.object,
        // from connect
        isUserSignupOpen: PropTypes.bool,
        isUserLoginOpen: PropTypes.bool,
        isUserPreferenceOpen: PropTypes.bool,
        isTopicPopupOpen: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        userSlug: PropTypes.string,
        topicSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        currentTagSlugs: PropTypes.array,
        showUserSignup: PropTypes.func,
        showUserLogin: PropTypes.func,
        showUserPreference: PropTypes.func,
        showTopicPopup: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._anchorEl = null;

        // Check if temporary article in local storage
        const temporaryArticle = getLocalData('article-temporary');
        if (temporaryArticle && temporaryArticle.length > 0) {
            this.state.hasTemporaryArticle = true;
        }
    }

    state = {
        isMobileOpen: false,
        isMobileBookmarkOpen: false,
        isMobileArticleOpen: false,
        isMobileUserOpen: false,
        hasTemporaryArticle: false
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

    _handleDrawerToggle = () => {
        this.setState(state => ({isMobileOpen: !state.isMobileOpen}));
    };

    _handleMobileBookmarkClick = () => {
        this.setState((state) => ({isMobileBookmarkOpen: !state.isMobileBookmarkOpen}));
    };

    _handleMobileArticleClick = () => {
        this.setState((state) => ({isMobileArticleOpen: !state.isMobileArticleOpen}));
    };

    _handleMobileUserClick = () => {
        this.setState((state) => ({isMobileUserOpen: !state.isMobileUserOpen}));
    };

    _handleTopicOpen = () => {
        this.props.showTopicPopup(true);
    };

    _handleTopicClose = () => {
        this.props.showTopicPopup(false);
    };

    _handlePreferenceClick = () => {
        this.props.showUserPreference();
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
                <HomeArticleHeader userSlug={this.props.userSlug}
                                   topicSlug={this.props.topicSlug}
                                   currentTagSlugs={this.props.currentTagSlugs}
                                   hasTemporaryArticle={this.state.hasTemporaryArticle}/>

                <HomeBookmarkHeader/>

                <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                isAdminConnected={this.props.isAdminConnected}
                                onPreferenceClick={this._handlePreferenceClick}
                                userSlug={this.props.userSlug}/>
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
                                      onClick={this._handleMobileArticleClick}>
                                <ListItemIcon>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Articles"/>
                                {this.state.isMobileArticleOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileArticleOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <HeaderArticleMenu classes={this.props.classes}
                                                   isNested={true}
                                                   match={this.props.match}
                                                   userSlug={this.props.userSlug}
                                                   currentTagSlugs={this.props.currentTagSlugs}
                                                   topicSlug={this.props.topicSlug}
                                                   hasTemporaryArticle={this.state.hasTemporaryArticle}/>
                            </Collapse>

                            <ListItem button={true}
                                      onClick={this._handleMobileBookmarkClick}>
                                <ListItemIcon>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Favoris"/>
                                {this.state.isMobileBookmarkOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileBookmarkOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <BookmarkList/>
                            </Collapse>

                            <ListItem button={true}
                                      onClick={this._handleMobileUserClick}>
                                <ListItemIcon>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Votre compte"/>
                                {this.state.isMobileUserOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileUserOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <HeaderUserMenu classes={this.props.classes}
                                                isNested={true}
                                                userSlug={this.props.userSlug}
                                                onPreferenceClick={this._handlePreferenceClick}/>
                            </Collapse>
                        </List>

                        <Divider/>

                        <TagSidebar isOpen={true}/>
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
                        <div className={this.props.classes.sectionMobile}>
                            <IconButton className={this.props.classes.menuButton}
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>

                            <Link className={this.props.classes.title}
                                  to="/">
                                <h1>
                                    InR
                                </h1>
                            </Link>
                        </div>

                        {
                            (this.props.isUserLoaded && this.props.currentTopic) &&
                            <>
                                <Button buttonRef={(ref) => this._anchorEl = ref}
                                        className={this.props.classes.topicButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={this._handleTopicOpen}>
                                    <span className={this.props.classes.sectionDesktop}>
                                        {I18n.t('js.views.header.topic.button', {current: this.props.currentTopic.name})}
                                    </span>

                                    <span className={this.props.classes.sectionMobile}>
                                        <ClassIcon/>
                                    </span>
                                </Button>

                                <Popover open={this.props.isTopicPopupOpen}
                                         anchorEl={this._anchorEl}
                                         // anchorPosition={{top: 200, left: 400}}
                                         elevation={6}
                                         onClose={this._handleTopicClose}
                                         anchorOrigin={{
                                             vertical: 'bottom',
                                             horizontal: 'left',
                                         }}
                                         transformOrigin={{
                                             vertical: 'top',
                                             horizontal: 'center',
                                         }}>
                                    <TopicModule onClose={this._handleTopicClose}/>
                                </Popover>
                            </>
                        }

                        <div className={this.props.classes.sectionDesktop}>
                            <Link to="/">
                                <h1 className={this.props.classes.title}>
                                    {I18n.t('js.views.header.title')}
                                </h1>
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

                <Preference isOpen={this.props.isUserPreferenceOpen}
                            onModalChange={this.props.showUserPreference}/>
            </>
        );
    }
}
