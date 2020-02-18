'use strict';

import {
    Suspense
} from 'react';

import {
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
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClassIcon from '@material-ui/icons/Class';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    HomeSearchHeader,
    UserPreference
} from '../../loaders/components';

import {
    getLocalData
} from '../../../middlewares/localStorage';

import {
    showUserPreference,
    showTopicPopup,
    logoutUser
} from '../../../actions';

import {
    getCurrentTagSlugs
} from '../../../selectors';

import {
    rootPath
} from '../../../constants/routesHelper';

import {
    articleTemporaryDataName
} from '../../modules/constants';

import HeadLayout from '../head';

import TopicModule from '../../topics/module';

import BookmarkList from '../../bookmark/list';

import TagSidebar from '../../tags/sidebar';

import ArticleSidebar from '../../articles/sidebar';

import HomeBookmarkHeader from '../header/bookmark';
import HomeArticleHeader from '../header/article';
import HomeUserHeader from '../header/user';

import HeaderUserMenu from '../header/menus/user';
import HeaderArticleMenu from '../header/menus/article';

import styles from '../../../../jss/user/header';

export default @connect((state) => ({
    routeProperties: state.routerState.currentRoute,
    routeParams: state.routerState.params,
    routeLocation: state.routerState.location,
    metaTags: state.uiState.metaTags,
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
    showUserPreference,
    showTopicPopup
})
@withWidth()
@withStyles(styles)
class HeaderLayoutUser extends React.PureComponent {
    static propTypes = {
        hashRoutes: PropTypes.object.isRequired,
        // from connect
        routeProperties: PropTypes.object,
        routeParams: PropTypes.object,
        routeLocation: PropTypes.object,
        metaTags: PropTypes.object,
        isUserPreferenceOpen: PropTypes.bool,
        isTopicPopupOpen: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        userSlug: PropTypes.string,
        topicSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        currentTagSlugs: PropTypes.array,
        showUserPreference: PropTypes.func,
        showTopicPopup: PropTypes.func,
        // from withWidth
        width: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._anchorEl = null;

        // Check if temporary article in local storage
        const temporaryArticle = getLocalData(articleTemporaryDataName);
        if (temporaryArticle?.length > 0) {
            this.state.hasTemporaryArticle = true;
        }
    }

    state = {
        isMobileTagSidebarOpen: false,
        isMobileArticleSidebarOpen: false,
        isMobileBookmarkOpen: false,
        isMobileArticleOpen: false,
        isMobileUserOpen: false,
        hasTemporaryArticle: false
    };

    _handleTagDrawerToggle = () => {
        this.setState((state) => ({isMobileTagSidebarOpen: !state.isMobileTagSidebarOpen}));
    };

    _handleArticleDrawerToggle = () => {
        this.setState((state) => ({isMobileArticleSidebarOpen: !state.isMobileArticleSidebarOpen}));
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

    _handleLogoutClick = () => {
        logoutUser().then(() => {
            window.location.assign('/');
            window.location.reload();
        });
    };

    _renderDesktopMenu = () => {
        return (
            <div className={this.props.classes.sectionDesktop}
                 aria-label="Navigation"
                 itemScope={true}
                 itemType="https://schema.org/SiteNavigationElement">
                <HomeArticleHeader routeParams={this.props.routeParams}
                                   userSlug={this.props.userSlug}
                                   topicSlug={this.props.topicSlug}
                                   currentTopicMode={this.props.currentTopic?.mode}
                                   currentTagSlugs={this.props.currentTagSlugs}
                                   hasTemporaryArticle={this.state.hasTemporaryArticle}/>

                <HomeBookmarkHeader/>

                <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                isAdminConnected={this.props.isAdminConnected}
                                onPreferenceClick={this._handlePreferenceClick}
                                onLogoutClick={this._handleLogoutClick}
                                userSlug={this.props.userSlug}/>
            </div>
        );
    };

    _renderMobileTagDrawer = () => {
        if (this.props.width !== 'xs' && this.props.width !== 'sm' && this.props.width !== 'md') {
            return null
        }

        return (
            <SwipeableDrawer variant="temporary"
                             anchor="left"
                             classes={{
                                 paper: this.props.classes.mobileDrawerPaper
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileTagSidebarOpen}
                             onClose={this._handleTagDrawerToggle}
                             onOpen={this._handleTagDrawerToggle}>
                <>
                    <div className={this.props.classes.mobileToolbar}>
                        <h5 className={this.props.classes.mobileTitle}
                            itemProp="name">
                            <Link className="header-brand-logo-mobile"
                                  to={rootPath()}
                                  title={window.settings.website_name}
                                  itemProp="url">
                                {window.settings.website_name}
                            </Link>
                        </h5>
                    </div>

                    <List>
                        <ListItem button={true}
                                  onClick={this._handleMobileArticleClick}>
                            <ListItemIcon>
                                <AssignmentIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.articles')}/>
                            {this.state.isMobileArticleOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.isMobileArticleOpen}
                                  timeout="auto"
                                  unmountOnExit={true}>
                            <HeaderArticleMenu classes={this.props.classes}
                                               isNested={true}
                                               routeParams={this.props.routeParams}
                                               userSlug={this.props.userSlug}
                                               topicSlug={this.props.topicSlug}
                                               currentTopicMode={this.props.currentTopic?.mode}
                                               currentTagSlugs={this.props.currentTagSlugs}
                                               hasTemporaryArticle={this.state.hasTemporaryArticle}/>
                        </Collapse>

                        <ListItem button={true}
                                  onClick={this._handleMobileBookmarkClick}>
                            <ListItemIcon>
                                <FavoriteIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.bookmarks')}/>
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
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={I18n.t('js.views.header.user.profile')}/>
                            {this.state.isMobileUserOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.isMobileUserOpen}
                                  timeout="auto"
                                  unmountOnExit={true}>
                            <HeaderUserMenu classes={this.props.classes}
                                            isNested={true}
                                            userSlug={this.props.userSlug}
                                            isAdminConnected={this.props.isAdminConnected}
                                            onPreferenceClick={this._handlePreferenceClick}
                                            onLogoutClick={this._handleLogoutClick}/>
                        </Collapse>
                    </List>

                    <Divider className={this.props.classes.mobileDivider}/>

                    <Typography className="center-align"
                                variant="overline"
                                display="block"
                                gutterBottom={false}>
                        {I18n.t('js.views.header.tags.button')}
                    </Typography>

                    <TagSidebar isOpen={true}
                                isCloud={this.props.routeProperties.tagCloud}
                                currentTagSlug={this.props.routeParams.tagSlug}
                                currentChildTagSlug={this.props.routeParams.childTagSlug}
                                onTagClick={this._handleTagDrawerToggle}/>
                </>
            </SwipeableDrawer>
        );
    };

    _renderMobileArticleDrawer = () => {
        if (this.props.width !== 'xs' && this.props.width !== 'sm') {
            return null;
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
                             open={this.state.isMobileArticleSidebarOpen}
                             onClose={this._handleArticleDrawerToggle}
                             onOpen={this._handleArticleDrawerToggle}>
                <ArticleSidebar/>
            </SwipeableDrawer>
        );
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

    render() {
        const isSearchActive = this.props.routeLocation.hash === '#search';

        return (
            <>
                <AppBar position="fixed"
                        className={classNames('animate-search', this.props.classes.appBar)}
                        itemScope={true}
                        itemType="https://schema.org/Organization">
                    <LoadingBar showFastActions={true}
                                style={{backgroundColor: '#036603', height: '2px'}}/>

                    <Toolbar className={classNames(this.props.classes.toolbar)}>
                        <div className={this.props.classes.sectionMobile}>
                            <IconButton className={this.props.classes.menuButton}
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleTagDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>
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
                            <h1 className={this.props.classes.title}
                                itemProp="name">
                                <Link className="header-brand-logo"
                                      to={rootPath()}
                                      title={window.settings.website_name}
                                      itemProp="url">
                                    {window.settings.website_name}
                                </Link>
                            </h1>
                        </div>

                        <div className={this.props.classes.grow}/>

                        {
                            !this.props.routeProperties.noHeaderSearch &&
                            <Suspense fallback={<div/>}>
                                <HomeSearchHeader isSearchActive={isSearchActive}/>
                            </Suspense>
                        }

                        <div className={this.props.classes.grow}/>

                        {this._renderDesktopMenu()}
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

                {this._renderMobileTagDrawer()}

                {
                    this.props.routeProperties.articleSidebar &&
                    this._renderMobileArticleDrawer()
                }

                <Suspense fallback={<div/>}>
                    {this._renderHashRoutes(this.props.hashRoutes.topic)}
                </Suspense>

                <Suspense fallback={<div/>}>
                    {this._renderHashRoutes(this.props.hashRoutes.article)}
                </Suspense>

                <HeadLayout>
                    {this.props.metaTags}
                </HeadLayout>

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                <Suspense fallback={<div/>}>
                    <UserPreference isOpen={this.props.isUserPreferenceOpen}
                                    onModalChange={this.props.showUserPreference}/>
                </Suspense>
            </>
        );
    }
}
