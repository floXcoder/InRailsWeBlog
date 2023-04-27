'use strict';

import {
    Suspense
} from 'react';

import {
    lazyImporter
} from '../../loaders/lazyLoader';

import withRouter from '../../modules/router';
import withWidth from '../../modules/mediaQuery';

import ErrorBoundary from '../../errors/boundary';

const TagSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-tag" */ './tagSidebar'));
const ArticleSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-article" */ './articleSidebar'));
const SearchSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-search" */ './searchSidebar'));


export default @connect((state) => ({
    currentUserSlug: state.userState.currentSlug,
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@withRouter({params: true})
@withWidth()
class SidebarLayoutUser extends React.Component {
    static propTypes = {
        // from layout
        routeProperties: PropTypes.object,
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUserSlug: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        // from withWidth
        width: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.width !== nextProps.width ||
            this.props.articleDisplayMode !== nextProps.articleDisplayMode ||
            this.props.currentUserSlug !== nextProps.currentUserSlug ||
            JSON.stringify(this.props.routeParams) !== JSON.stringify(nextProps.routeParams) ||
            JSON.stringify(this.props.routeProperties) !== JSON.stringify(nextProps.routeProperties);
    }

    render() {
        const isGridDisplay = this.props.articleDisplayMode === 'grid';
        const isLargeEnough = this.props.width !== 'xs' && this.props.width !== 'sm' && this.props.width !== 'md';
        const isUserData = this.props.routeParams?.userSlug ? this.props.routeParams.userSlug === this.props.currentUserSlug : true;
        const isArticle = !!(this.props.routeParams?.userSlug && this.props.routeParams?.articleSlug);

        return (
            <>
                {
                    !!(!this.props.routeProperties.noTagSidebar && isLargeEnough && isUserData) &&
                    <Suspense fallback={<div/>}>
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                            <div className="layout-user-sidebar">
                                <TagSidebarLayout routeParams={this.props.routeParams}
                                                  isCloud={this.props.routeProperties.tagCloud}/>
                            </div>
                        </ErrorBoundary>
                    </Suspense>
                }

                {
                    !!(this.props.routeProperties.searchSidebar && isLargeEnough) &&
                    <Suspense fallback={<div/>}>
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                            <div className="layout-user-sidebar">
                                <SearchSidebarLayout/>
                            </div>
                        </ErrorBoundary>
                    </Suspense>
                }

                {
                    !!(this.props.routeProperties.articleSidebar && !isGridDisplay && isLargeEnough) &&
                    <Suspense fallback={<div/>}>
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                            <div className="layout-user-sidebar">
                                <ArticleSidebarLayout parentTagSlug={this.props.routeParams.tagSlug}
                                                      isArticle={isArticle}/>
                            </div>
                        </ErrorBoundary>
                    </Suspense>
                }
            </>
        );
    }
}
