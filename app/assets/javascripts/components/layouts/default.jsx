'use strict';

import {
    Route
} from 'react-router-dom';

import {
    initUser,
    fetchTopics,
    fetchTags
} from '../../actions';

import LoadingLayout from './loading';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import FooterLayout from './footer';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitizePaste';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    userCurrentId: state.userState.currentId,
    topicCurrentId: state.topicState.currentTopic && state.topicState.currentTopic.id,
    isLoadingUser: state.userState.isFetching
}), {
    initUser,
    fetchTopics,
    fetchTags
})
export default class DefaultLayout extends React.Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        exact: PropTypes.bool,
        // From switch
        computedMatch: PropTypes.object,
        // From connect
        isUserConnected: PropTypes.bool,
        userCurrentId: PropTypes.number,
        topicCurrentId: PropTypes.number,
        isLoadingUser: PropTypes.bool,
        initUser: PropTypes.func,
        fetchTopics: PropTypes.func,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        exact: false
    };

    constructor(props) {
        super(props);

        this._router = null;

        // Load user environment if connected
        if (props.isUserConnected) {
            // Get current user details with current topic
            props.initUser(props.userCurrentId, {userProfile: true})
                .then((response) => {
                    if (response && response.user) {
                        // Get all user topics
                        props.fetchTopics(props.userCurrentId);

                        // Get all user tags for current topic (private user tags and common public tags associated to articles)
                        props.fetchTags({topicId: response.user.currentTopic.id});
                    }
                });
        } else {
            // Get all public tags (by default)
            props.fetchTags();
        }
    }

    state = {
        isSidebarOpened: true
    };

    componentDidMount() {
        ClipboardManager.initialize(this._onPaste);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.topicCurrentId !== nextProps.topicCurrentId) {
            this.props.fetchTags({topicId: nextProps.topicCurrentId});
        }

        // if (!Object.equals(this.props.computedMatch.params, nextProps.computedMatch.params)) {
        //     log.info(nextProps.computedMatch.params)
        // }
    }

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

    render() {
        const {component: Component, ...props} = this.props;

        if (this.props.isLoadingUser) {
            return (
                <div>
                    <LoadingLayout/>
                </div>
            );
        }

        return (
            <Route {...props}
                   render={
                       (router) => {
                           this._router = router;

                           return (
                               <div className="blog-content">
                                   <HeaderLayout/>

                                   <SidebarLayout params={router.match.params}
                                                  onOpened={this._handleSidebarPinClick}/>

                                   <div
                                       className={classNames('blog-main-content', {'blog-main-pinned': this.state.isSidebarOpened})}>
                                       <div className="container blog-main">
                                           {
                                               this.props.routes.permanents.map((route, index) => (
                                                   <Route key={index}
                                                          path={`${router.match.path}/${route.path}`}
                                                          component={route.component}/>
                                               ))
                                           }

                                           <Component params={router.match.params}/>
                                       </div>

                                       <a className="goto-top hide-on-small-and-down"
                                          onClick={this._handleGoToTopClick}/>
                                   </div>

                                   <FooterLayout/>
                               </div>
                           );
                       }
                   }/>
        );
    }
}
