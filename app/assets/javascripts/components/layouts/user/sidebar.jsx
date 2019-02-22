'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import {
    getRouteProperties,
    getRouteParams
} from '../../../selectors';

import ErrorBoundary from '../../errors/boundary';

import TagSidebarLayout from './tagSidebar';
import ArticleSidebarLayout from './articleSidebar';
import BreadcrumbLayout from '../breadcrumb';

import styles from '../../../../jss/user/main';

export default @connect((state) => ({
    routeProperties: getRouteProperties(state),
    routeParams: getRouteParams(state)
}))
@withWidth()
@withStyles(styles)
class SidebarLayoutUser extends React.Component {
    static propTypes = {
        // from connect
        routeProperties: PropTypes.object,
        routeParams: PropTypes.object,
        // from withWidth
        width: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {
                    (this.props.width !== 'xs' && this.props.width !== 'sm') &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.sidebar}>
                            <TagSidebarLayout routeParams={this.props.routeParams}
                                              isCloud={this.props.routeProperties.tagCloud}/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    (this.props.routeProperties.articleSidebar && (this.props.width !== 'xs' && this.props.width !== 'sm')) &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.sidebar}>
                            <ArticleSidebarLayout parentTag={this.props.routeParams.tagSlug}/>
                        </div>
                    </ErrorBoundary>
                }

                {
                    this.props.routeProperties.hasBreadcrumb &&
                    <ErrorBoundary errorType="text"
                                   errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                        <div className={this.props.classes.breadcrumb}>
                            <BreadcrumbLayout currentPath={router.location.pathname}
                                              recentsLimit={8}/>
                        </div>
                    </ErrorBoundary>
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
