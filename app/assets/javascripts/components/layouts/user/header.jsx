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

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClassIcon from '@mui/icons-material/Class';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssignmentIcon from '@mui/icons-material/Assignment';

import {
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
    userHomePath
} from '../../../constants/routesHelper';

import {
    articleTemporaryDataName
} from '../../modules/constants';

import {
    lazyImporter
} from '../../loaders/lazyLoader';

import withRouter from '../../modules/router';
import withWidth from '../../modules/mediaQuery';

import ErrorBoundary from '../../errors/boundary';

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

const HomeSearchHeader = lazyImporter(() => import(/* webpackChunkName: "header-search" */ '../header/search'));

const loadingBarStyle = {
    backgroundColor: '#036603',
    height: '2px'
};


export default @connect((state) => ({
    metaTags: state.uiState.metaTags,
    isUserPreferenceOpen: state.uiState.isUserPreferenceOpen,
    isTopicPopupOpen: state.uiState.isTopicPopupOpen,
    isUserConnected: state.userState.isConnected,
    isAdminConnected: state.userState.isAdminConnected,
    userSlug: state.userState.currentSlug,
    topicSlug: state.topicState.currentUserTopicSlug,
    currentTopic: state.topicState.currentTopic,
    currentTagSlugs: getCurrentTagSlugs(state)
}), {
    showUserPreference,
    showTopicPopup
})
@withRouter({
    location: true,
    params: true
})
@withWidth()
class HeaderLayoutUser extends React.PureComponent {
    static propTypes = {
        searchModule: PropTypes.object.isRequired,
        // from layout
        routeProperties: PropTypes.object.isRequired,
        // from router
        routeLocation: PropTypes.object,
        routeParams: PropTypes.object,
        // from connect
        metaTags: PropTypes.object,
        isUserPreferenceOpen: PropTypes.bool,
        isTopicPopupOpen: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        userSlug: PropTypes.string,
        topicSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        currentTagSlugs: PropTypes.array,
        showUserPreference: PropTypes.func,
        showTopicPopup: PropTypes.func,
        // from withWidth
        width: PropTypes.string
    };

    constructor(props) {
        super(props);

        this._anchorEl = null;

        // Check if temporary article in local storage
        const temporaryArticle = getLocalData(articleTemporaryDataName);
        if (temporaryArticle?.article) {
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

    componentDidMount() {
        // Clean timestamp after connection
        if (window.location.search.includes('_=')) {
            const url = new URL(window.location);
            url.searchParams.delete('_');
            window.history.replaceState(null, null, url);
        }
    }

    _handleMobileTitleClick = () => {
        this._handleTagDrawerToggle();
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
        this._handleTagDrawerToggle();

        this.props.showUserPreference();
    };

    _handleLogoutClick = () => {
        logoutUser()
            .then((response) => {
                // Add timestamp to ensure page is not cached
                const timestamp = Date.now();
                const urlParams = window.location.search;
                const newUrl = (response?.location ? response.location : window.location.href) + (urlParams ? urlParams + '&' : '?') + `_=${timestamp}`;
                window.location.replace(newUrl);
            });
    };

    _renderDesktopMenu = () => {
        return (
            <div className="layout-header-section-desktop"
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
            return null;
        }

        return (
            <SwipeableDrawer variant="temporary"
                             anchor="left"
                             classes={{
                                 paper: 'layout-header-mobile-drawer-paper'
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileTagSidebarOpen}
                             onClose={this._handleTagDrawerToggle}
                             onOpen={this._handleTagDrawerToggle}>
                <>
                    <div className="layout-header-mobile-toolbar">
                        <h5 className="layout-header-mobile-title"
                            itemProp="name">
                            <Link className="header-brand-logo-mobile"
                                  to={userHomePath(this.props.userSlug)}
                                  title={window.settings.website_name}
                                  itemProp="url"
                                  onClick={this._handleMobileTitleClick}>
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
                            <HeaderArticleMenu isNested={true}
                                               routeParams={this.props.routeParams}
                                               userSlug={this.props.userSlug}
                                               topicSlug={this.props.topicSlug}
                                               currentTopicMode={this.props.currentTopic?.mode}
                                               currentTagSlugs={this.props.currentTagSlugs}
                                               hasTemporaryArticle={this.state.hasTemporaryArticle}
                                               onItemClick={this._handleTagDrawerToggle}/>
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
                            <BookmarkList onBookmarkClick={this._handleTagDrawerToggle}/>
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
                            <HeaderUserMenu isNested={true}
                                            userSlug={this.props.userSlug}
                                            isAdminConnected={this.props.isAdminConnected}
                                            onPreferenceClick={this._handlePreferenceClick}
                                            onLogoutClick={this._handleLogoutClick}/>
                        </Collapse>
                    </List>

                    <Divider className="layout-header-mobile-divider"/>

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

        const isArticle = !!(this.props.routeParams?.userSlug && this.props.routeParams?.articleSlug);

        return (
            <SwipeableDrawer variant="temporary"
                             anchor="right"
                             classes={{
                                 paper: 'layout-header-mobile-drawer-paper'
                             }}
                             ModalProps={{
                                 keepMounted: true
                             }}
                             open={this.state.isMobileArticleSidebarOpen}
                             onClose={this._handleArticleDrawerToggle}
                             onOpen={this._handleArticleDrawerToggle}>
                <ArticleSidebar parentTagSlug={this.props.routeParams.tagSlug}
                                isArticle={isArticle}/>
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
                <AppBar id="header-user"
                        position="fixed"
                        className="animate-search layout-header-app-bar"
                        itemScope={true}
                        itemType="https://schema.org/Organization">
                    <LoadingBar showFastActions={true}
                                style={loadingBarStyle}/>

                    <Toolbar className="layout-header-toolbar">
                        <div className="layout-header-section-mobile">
                            <IconButton
                                className="layout-header-menu-button"
                                color="primary"
                                aria-label="Open drawer"
                                onClick={this._handleTagDrawerToggle}
                                size="large">
                                <MenuIcon/>
                            </IconButton>
                        </div>

                        <div className="layout-header-section-desktop">
                            <div className="layout-header-title"
                                 itemProp="name">
                                <Link className="header-brand-logo"
                                      to={userHomePath(this.props.userSlug)}
                                      title={window.settings.website_name}
                                      itemProp="url">
                                    {window.settings.website_name}
                                </Link>
                            </div>
                        </div>

                        {
                            !!(this.props.isUserConnected && this.props.currentTopic) &&
                            <>
                                <Button ref={(ref) => this._anchorEl = ref}
                                        className="layout-header-topic-button"
                                        variant="contained"
                                        color="primary"
                                        onClick={this._handleTopicOpen}>
                                    <span className="layout-header-section-desktop">
                                        {I18n.t('js.views.header.topic.button', {current: this.props.currentTopic.name})}
                                    </span>

                                    <span className="layout-header-section-mobile">
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

                        <div className="layout-header-grow"/>

                        {
                            !this.props.routeProperties.noHeaderSearch &&
                            <Suspense fallback={<div/>}>
                                <HomeSearchHeader isSearchActive={isSearchActive}/>
                            </Suspense>
                        }

                        <div className="layout-header-grow"/>

                        {this._renderDesktopMenu()}
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

                {this._renderMobileTagDrawer()}

                {
                    !!this.props.routeProperties.articleSidebar &&
                    this._renderMobileArticleDrawer()
                }

                <HeadLayout>
                    {this.props.metaTags}
                </HeadLayout>

                <div id="clipboard-area"
                     className="hidden">
                <textarea id="clipboard"
                          title="clipboard"/>
                </div>

                <Suspense fallback={<div/>}>
                    <ErrorBoundary errorType="notification">
                        <UserPreference isOpen={this.props.isUserPreferenceOpen}
                                        onModalChange={this.props.showUserPreference}/>
                    </ErrorBoundary>
                </Suspense>
            </>
        );
    }
}
