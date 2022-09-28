'use strict';

import withRouter from '../../modules/router';
import withWidth from '../../modules/mediaQuery';

import ErrorBoundary from '../../errors/boundary';

import TagSidebarLayout from './tagSidebar';
import ArticleSidebarLayout from './articleSidebar';
import SearchSidebarLayout from './searchSidebar';


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

        return (
            <>
                {
                    !!(!this.props.routeProperties.noTagSidebar && isLargeEnough && isUserData) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className="layout-user-sidebar">
                            <TagSidebarLayout routeParams={this.props.routeParams}
                                              isCloud={this.props.routeProperties.tagCloud}/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    !!(this.props.routeProperties.searchSidebar && isLargeEnough) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className="layout-user-sidebar">
                            <SearchSidebarLayout/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    !!(this.props.routeProperties.articleSidebar && !isGridDisplay && isLargeEnough) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className="layout-user-sidebar">
                            <ArticleSidebarLayout parentTagSlug={this.props.routeParams.tagSlug}/>
                        </div>
                    </ErrorBoundary>
                }
            </>
        );
    }
}
