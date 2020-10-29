'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import ErrorBoundary from '../../errors/boundary';

import TagSidebarLayout from './tagSidebar';
import ArticleSidebarLayout from './articleSidebar';
import SearchSidebarLayout from './searchSidebar';
// import BreadcrumbLayout from '../breadcrumb';

import styles from '../../../../jss/user/main';

export default @connect((state) => ({
    routeProperties: state.routerState.currentRoute,
    routeParams: state.routerState.params,
    currentUserSlug: state.userState.currentSlug,
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@withWidth()
@withStyles(styles)
class SidebarLayoutUser extends React.Component {
    static propTypes = {
        // from connect
        routeProperties: PropTypes.object,
        routeParams: PropTypes.object,
        currentUserSlug: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        // from withWidth
        width: PropTypes.string,
        // from styles
        classes: PropTypes.object
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

        return (
            <>
                {
                    (!this.props.routeProperties.noTagSidebar && isLargeEnough && isUserData) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.sidebar}>
                            <TagSidebarLayout routeParams={this.props.routeParams}
                                              isCloud={this.props.routeProperties.tagCloud}/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    (this.props.routeProperties.searchSidebar && isLargeEnough) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.sidebar}>
                            <SearchSidebarLayout/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    (this.props.routeProperties.articleSidebar && !isGridDisplay && isLargeEnough) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.sidebar}>
                            <ArticleSidebarLayout parentTagSlug={this.props.routeParams.tagSlug}/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    // this.props.routeProperties.hasBreadcrumb &&
                    // <ErrorBoundary errorType="text"
                    //                errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                    //     <div className={this.props.classes.breadcrumb}>
                    //         <BreadcrumbLayout currentPath={this.props.routeLocation.pathname}
                    //                           recentsLimit={8}/>
                    //     </div>
                    // </ErrorBoundary>
                }

                {
                    // (router.match.params.tagSlug || router.match.params.parentTagSlug || router.match.params.childTagSlug) &&
                    // <Link className={this.props.classes.quickAdd}
                    //       to={{
                    //           hash: '#new-article',
                    //           state: {
                    //               parentTagSlug: router.match.params.parentTagSlug || router.match.params.tagSlug,
                    //               childTagSlug: router.match.params.childTagSlug
                    //           }
                    //       }}>
                    //     <AddCircleOutlineIcon
                    //         className={this.props.classes.quickAddIcon}/>
                    // </Link>
                }
            </>
        );
    }
}
