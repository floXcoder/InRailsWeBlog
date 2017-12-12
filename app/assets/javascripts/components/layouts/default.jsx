'use strict';

import {
    Route
} from 'react-router-dom';

import {
    fetchUser
} from '../../actions';

import LoadingLayout from './loading';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import FooterLayout from './footer';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitizePaste';


@connect((state) => ({
    isUserConnected: state.userState.isUserConnected,
    userCurrentId: state.userState.currentId,
    isLoadingUser: state.userState.isFetching
}), {
    fetchUser
})
export default class DefaultLayout extends React.Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        exact: PropTypes.bool,
        // From connect
        isUserConnected: PropTypes.bool,
        userCurrentId: PropTypes.number,
        isLoadingUser: PropTypes.bool,
        fetchUser: PropTypes.func
    };

    static defaultProps = {
        isUserConnected: false,
        exact: false,
        isLoadingUser: false
    };

    constructor(props) {
        super(props);

        this._router = null;

        if (this.props.isUserConnected) {
            this.props.fetchUser(this.props.userCurrentId, {userProfile: true});
        }
    }

    state = {
        isSidebarOpened: true
    };

    componentDidMount() {
        this._onInit();
    }

    _onInit = () => {
        ClipboardManager.initialize(this._onPaste);
    };

    _onPaste = (content) => {
        if (this._router && this.props.path !== '/article/new') {
            this._router.history.push({
                pathname: '/article/new',
                state: {article: {content: SanitizePaste.parse(content), draft: true}}
            });
        }
    };

    _handleSidebarPinClick = (isPinned) => {
        this.setState({
            isSidebarOpened: isPinned
        });
    };

    _handleGoToTopClick = (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
    };

    _handleReloadPage = () => {
        // TODO
        // this.setState({
        //     isLoadingUser: true
        // });
    };

    render() {
        const {component: Component, ...props} = this.props;

        return (
            <div>
                {
                    this.props.isLoadingUser
                        ?
                        <div>
                            <LoadingLayout path={this.props.routes.init.path}
                                           exact={this.props.routes.init.exact}/>
                        </div>
                        :
                        <Route {...props}
                               render={router => {
                                   this._router = router;

                                   return (
                                       <div className="blog-content">
                                           <HeaderLayout onReloadPage={this._handleReloadPage}/>

                                           <SidebarLayout router={router}
                                                          onOpened={this._handleSidebarPinClick}/>

                                           <div
                                               className={classNames('blog-main-content', {'blog-main-pinned': this.state.isSidebarOpened})}>
                                               <div className="container blog-main">
                                                   <Component/>
                                               </div>

                                               <a className="goto-top hide-on-small-and-down"
                                                  onClick={this._handleGoToTopClick}/>
                                           </div>

                                           <FooterLayout/>
                                       </div>
                                   );
                               }}/>
                }
            </div>
        );
    }
}
