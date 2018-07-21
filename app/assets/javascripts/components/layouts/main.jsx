'use strict';

import {
    Route,
    Link
} from 'react-router-dom';

import matchMedia from '../modules/matchMedia';

import UserManager from './managers/user';
import HotkeyManager from './managers/hotkey';

import ErrorBoundary from '../errors/boundary';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import BreadcrumbLayout from './breadcrumb';
import FooterLayout from './footer';

@matchMedia
export default class MainLayout extends React.Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        exact: PropTypes.bool,
        // From pasteManager
        onPaste: PropTypes.func,
        // From matchMedia
        isMediumScreen: PropTypes.bool
    };

    static defaultProps = {
        exact: false
    };

    constructor(props) {
        super(props);

        this._router = null;
    }

    state = {
        isSidebarOpened: !this.props.isMediumScreen
    };

    _handleSidebarPinClick = (isPinned) => {
        this.setState({
            isSidebarOpened: isPinned
        });
    };

    _handleSearchOpen = () => {
        if (this._router && this._router.location.hash !== '#search') {
            this._router.history.push({
                hash: 'search'
            });
        }
    };

    _handleSearchClose = () => {
        if (this._router && this._router.location.hash === '#search') {
            this._router.history.push({
                hash: undefined
            });
        }
    };

    _handleCoverClick = (event) => {
        event.preventDefault();

        this._handleSearchClose();
    };

    _handleGoToTopClick = (event) => {
        event.preventDefault();

        window.scrollTo(0, 0);
    };

    _renderPermanentRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location, history}) => (
                       <div>
                           {
                               location.hash === `#${route.path}` &&
                               <route.component params={match.params}
                                                history={history}
                                                initialData={location.state}/>
                           }
                       </div>
                   )}/>
        ));
    };

    render() {
        const {component: Component, ...props} = this.props;

        return (
            <Route {...props}
                   render={(router) => {
                       this._router = router;

                       const hasSearch = router.location.hash === '#search';

                       return (
                           <UserManager routerState={router.location.state}>
                               <HotkeyManager history={router.history}>
                                   <div className="blog-content">
                                       <ErrorBoundary errorType="text"
                                                      errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                           <HeaderLayout history={router.history}
                                                         params={router.match.params}
                                                         hasSearch={hasSearch}
                                                         onSearchOpen={this._handleSearchOpen}
                                                         onSearchClose={this._handleSearchClose}>
                                               {
                                                   this._renderPermanentRoutes(this.props.routes.permanents.header)
                                               }
                                           </HeaderLayout>
                                       </ErrorBoundary>

                                       <ErrorBoundary errorType="text"
                                                      className="sidebar sidebar-pin">
                                           <SidebarLayout isDefaultOpened={!this.props.isMediumScreen}
                                                          onOpened={this._handleSidebarPinClick}/>
                                       </ErrorBoundary>

                                       <ErrorBoundary errorType="card">
                                           <div className={classNames('blog-main-content', {
                                               'blog-main-pinned': this.state.isSidebarOpened
                                           })}>
                                               <ErrorBoundary errorType="text"
                                                              errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                                   <BreadcrumbLayout currentPath={router.location.pathname}
                                                                     recentsLimit={8}/>
                                               </ErrorBoundary>

                                               <div className="container blog-main">
                                                   {
                                                       this._renderPermanentRoutes(this.props.routes.permanents.main)
                                                   }

                                                   <Component params={router.match.params}
                                                              queryString={router.location.search}
                                                              history={router.history}
                                                              initialData={router.location.state}/>
                                               </div>

                                               {
                                                   (router.match.params.tagSlug || router.match.params.parentTagSlug || router.match.params.childTagSlug) &&
                                                   <Link className="article-quick-add"
                                                         to={{
                                                             hash: '#new-article',
                                                             state: {
                                                                 mode: 'note',
                                                                 parentTagSlug: router.match.params.parentTagSlug || router.match.params.tagSlug,
                                                                 childTagSlug: router.match.params.childTagSlug
                                                             }
                                                         }}>
                                                       <span className="material-icons"
                                                             data-icon="add_circle_outline"
                                                             aria-hidden="true"/>
                                                   </Link>
                                               }

                                               <a className="goto-top hide-on-small-and-down"
                                                  onClick={this._handleGoToTopClick}/>
                                           </div>
                                       </ErrorBoundary>

                                       <ErrorBoundary errorType="text"
                                                      errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                                           <FooterLayout/>
                                       </ErrorBoundary>

                                       <div className={classNames('blog-cover-layer', {
                                           'search-form-visible': hasSearch
                                       })}
                                            onClick={this._handleCoverClick}/>
                                   </div>
                               </HotkeyManager>
                           </UserManager>
                       );
                   }}/>
        );
    }
}
