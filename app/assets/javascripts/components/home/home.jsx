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

import createBrowserHistory from 'history/createBrowserHistory';

import {
    Link
} from 'react-router-dom';

const browserHistory = createBrowserHistory();

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

    state = {
        isUserLoading: $app.isUserConnected() && !$app.isUserLoaded()
    };

    onUserChange(userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (userData.type === 'InitUser') {
            newState.isUserLoading = false;
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

        if (topicData.type === 'switchTopic' || topicData.type === 'addTopic') {
            newState.isUserLoading = false;
            browserHistory.push(`/topic/${topicData.topic.slug}`);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleReloadPage = () => {
        this.setState({
            isUserLoading: true
        });
    };

    render() {
        return (
            <div>
                {
                    this.state.isUserLoading
                        ?
                        <div>
                            <LoadingLayout path={routes.init.path}
                                           exact={routes.init.exact}/>
                        </div>
                        :
                        <Router history={browserHistory}>
                            <Switch>
                                {
                                    routes.home.views.map((route, index) => (
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
