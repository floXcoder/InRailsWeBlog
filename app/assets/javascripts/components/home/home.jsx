'use strict';

import routes from '../../routes';

import UserStore from '../../stores/userStore';
import TopicStore from '../../stores/topicStore';

import DefaultLayout from '../layouts/default';
import LoadingLayout from '../layouts/loading';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

const browserHistory = createBrowserHistory();

// TODO: move to default layout
// import ClipboardManager from '../../modules/clipboard';
// import SanitizePaste from '../../modules/wysiwyg/sanitize-paste';

import {
    Link
} from 'react-router-dom';

export default class HomePage extends Reflux.Component {
    static propTypes = {
        location: PropTypes.object,
        children: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onUserChange);
        this.mapStoreToState(TopicStore, this.onTopicChange);
    }

    // TODO : move loading user to App
    state = {
        isLoadingPage:
            $app.isUserConnected()
    };

    onUserChange(userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (userData.type === 'InitUser') {
            newState.isLoadingPage = false;
            browserHistory.replace(`/topic/${$app.getCurrentTopic().slug}`);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    onTopicChange(topicData) {
        if ($.isEmpty(topicData)) {
            return;
        }

        let newState = {};

        if (topicData.type === 'switchTopic' || topicData.type === 'addTopic') {
            newState.isLoadingPage = false;
            browserHistory.push(`/topic/${topicData.topic.slug}`);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    // TODO: move to default layout
    // _userLoaded = () => {
    //     ClipboardManager.initialize(this._onPaste);
    // };

    // TODO: move to default layout
    // _onPaste = (content) => {
    //     if (this.props.location.pathname !== '/article/new') {
    //         this.props.router.history.push({
    //             pathname: '/article/new',
    //             state: {article: {content: SanitizePaste.parse(content), draft: true}}
    //         });
    //     }
    // };

    _handleReloadPage = () => {
        this.setState({
            isLoadingPage: true
        });
    };

    render() {
        return (
            <div>
                {
                    this.state.isLoadingPage
                        ?
                        <div>
                            <LoadingLayout path={routes.init.path}
                                           exact={routes.init.exact}/>
                        </div>
                        :
                        <Router history={browserHistory}>
                            <Switch>
                                {
                                    routes.home.mainView.map((route, index) => (
                                        <DefaultLayout key={index}
                                                       path={route.path}
                                                       exact={route.exact}
                                                       component={route.component}
                                                       onReloadPage={this._handleReloadPage}/>
                                    ))
                                }
                            </Switch>
                        </Router>
                }
            </div>
        );
    }
}
