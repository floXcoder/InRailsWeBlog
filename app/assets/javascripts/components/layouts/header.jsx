'use strict';

import {
    connect
} from 'react-redux';

import {
    Link,
    withRouter
} from 'react-router-dom';

import {
    switchUiTopicModule,
    fetchTopic
} from '../../actions/index';

// TODO
// import ModalHOC from '../../hoc/modal';

import Login from '../users/login';
import Signup from '../users/signup';

import SwitchTopicModule from '../topic/module';

import SearchModule from '../search/module';

import HomeSearchHeader from './header/search';
import HomeArticleHeader from './header/article';
import HomePreferenceHeader from './header/preference';
import HomeUserHeader from './header/user';
import HomeTopicHeader from './header/topic';

@withRouter
@connect((state, props) => ({
    isAdminConnected: state.userState.isAdminConnected,
    isUserConnected: state.userState.isUserConnected,
    userCurrentId: state.userState.userCurrentId,
    userSlug: state.userState.user.slug,
    currentTopic: state.topicState.currentTopic,
    isTopicOpened: state.uiState.isTopicOpened
}), {
    switchUiTopicModule,
    fetchTopic,
})
export default class HeaderLayout extends React.PureComponent {
    static propTypes = {
        onReloadPage: PropTypes.func.isRequired,
        fetchTopic: PropTypes.func.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        isAdminConnected: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        userCurrentId: PropTypes.number,
        userSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        switchTopicModule: PropTypes.func,
        isTopicOpened: PropTypes.bool
    };

    static defaultProps = {
        isAdminConnected: false,
        isUserConnected: false,
        userCurrentId: null,
        userSlug: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        isShowingSignup: true,
        isShowingLogin: true,
        isSearchOpened: false
    };

    componentWillMount() {
        if (this.props.userCurrentId && this.props.currentTopic.id) {
            this.props.fetchTopic(this.props.userCurrentId, this.props.currentTopic.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.props.fetchTopic(this.props.userCurrentId, this.props.currentTopic.id);
        }
    }

    _handleLoginClick = () => {
        this.setState({
            isShowingLogin: true
        });
    };

    _handleSignupClick = () => {
        this.setState({
            isShowingSignup: true
        });
    };

    _handleTopicClick = (event) => {
        event.preventDefault();

        this.props.switchUiTopicModule(!this.props.isTopicOpened);
    };

    _handleSearchClick = (event) => {
        event.preventDefault();

        this.setState({
            isSearchOpened: !this.state.isSearchOpened
        });
    };

    render() {
        return (
            <header className="blog-header">
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <ul className="left hide-on-med-and-down">
                                {
                                    this.props.isUserConnected &&
                                    <li>
                                        <HomeTopicHeader currentTopicName={this.props.currentTopic.name}
                                                         onTopicClick={this._handleTopicClick}/>
                                    </li>
                                }

                                <li>
                                    <HomeSearchHeader onSearchClick={this._handleSearchClick}/>
                                </li>
                            </ul>

                            <a className="brand-logo center"
                               href="/">
                                {I18n.t('js.views.header.title')}
                            </a>

                            <ul className="right hide-on-med-and-down">
                                <li>
                                    <HomeArticleHeader/>
                                </li>


                                {
                                    this.props.isUserConnected &&
                                    <li>
                                        <HomePreferenceHeader/>
                                    </li>
                                }


                                <li>
                                    <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                                    isAdminConnected={this.props.isAdminConnected}
                                                    userSlug={this.props.userSlug}
                                                    onLoginClick={this._handleLoginClick}
                                                    onSignupClick={this._handleSignupClick}/>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                {/*TODO*/}
                {/*<ModalHOC isOpened={this.props.isTopicOpened}>*/}
                    {/*<SwitchTopicModule/>*/}
                {/*</ModalHOC>*/}

                <div className="blog-search-nav row">
                    <SearchModule isOpened={this.state.isSearchOpened}/>
                </div>

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                {
                    this.state.isShowingSignup &&
                    <Signup launcherClass="signup-link"/>
                }

                {
                    this.state.isShowingLogin &&
                    <Login launcherClass="login-link"/>
                }
            </header>
        );
    }
}
