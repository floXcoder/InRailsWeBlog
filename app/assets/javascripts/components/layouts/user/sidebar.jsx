import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    lazyImporter
} from '@js/components/loaders/lazyLoader';

import withRouter from '@js/components/modules/router';
import withWidth from '@js/components/modules/mediaQuery';

import ErrorBoundary from '@js/components/errors/boundary';

const TagSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-tag" */ '@js/components/layouts/user/tagSidebar'));
const ArticleSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-article" */ '@js/components/layouts/user/articleSidebar'));
const SearchSidebarLayout = lazyImporter(() => import(/* webpackChunkName: "sidebar-search" */ '@js/components/layouts/user/searchSidebar'));


class SidebarLayoutUser extends React.Component {
    static propTypes = {
        // from layout
        routeProperties: PropTypes.object,
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUserSlug: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        articleTitleContent: PropTypes.array,
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
            this.props.articleTitleContent !== nextProps.articleTitleContent ||
            JSON.stringify(this.props.routeParams) !== JSON.stringify(nextProps.routeParams) ||
            JSON.stringify(this.props.routeProperties) !== JSON.stringify(nextProps.routeProperties);
    }

    render() {
        const isGridDisplay = this.props.articleDisplayMode === 'grid';
        const isLargeEnough = this.props.width !== 'xs' && this.props.width !== 'sm' && this.props.width !== 'md';
        const isUserData = this.props.routeParams?.userSlug ? this.props.routeParams.userSlug === this.props.currentUserSlug : true;
        const isArticle = !!(this.props.routeParams?.userSlug && this.props.routeParams?.articleSlug);
        const hasArticleContent = isArticle ? Utils.isPresent(this.props.articleTitleContent) && this.props.articleTitleContent.length > 1 : true;

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
                    !!(this.props.routeProperties.searchSidebar && isLargeEnough && this.props.articleAvailableFilters && this.props.articleAvailableFilters.length) &&
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
                    !!(this.props.routeProperties.articleSidebar && !isGridDisplay && isLargeEnough && hasArticleContent) &&
                    <Suspense fallback={<div/>}>
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                            <div className="layout-user-sidebar">
                                <ArticleSidebarLayout key={isArticle ? 'article' : 'list'}
                                                      parentTagSlug={this.props.routeParams.tagSlug}
                                                      isArticle={isArticle}/>
                            </div>
                        </ErrorBoundary>
                    </Suspense>
                }
            </>
        );
    }
}

export default connect((state) => ({
    currentUserSlug: state.userState.currentSlug,
    articleDisplayMode: state.uiState.articleDisplayMode,
    articleTitleContent: state.articleState.articleTitleContent,
    articleAvailableFilters: state.searchState.articleAvailableFilters
}))(withRouter({params: true})(withWidth()(SidebarLayoutUser)));
