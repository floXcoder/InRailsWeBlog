'use strict';

import {
    switchUserPopup,
    switchUserSignup,
    switchUserLogin,
    switchTopicPopup,
    switchSearchPopup,
    fetchTopic
} from '../../actions';

import Dialog from '../theme/dialog';

import Login from '../users/login';
import Signup from '../users/signup';

import TopicModule from '../topic/module';

import SearchModule from '../search/module';

import HomeSearchHeader from './header/search';
import HomeArticleHeader from './header/article';
import HomePreferenceHeader from './header/preference';
import HomeUserHeader from './header/user';
import HomeTopicHeader from './header/topic';

@connect((state) => ({
    isUserPopupOpened: state.uiState.isUserPopupOpened,
    isUserSignupOpened: state.uiState.isUserSignupOpened,
    isUserLoginOpened: state.uiState.isUserLoginOpened,
    isTopicPopupOpened: state.uiState.isTopicPopupOpened,
    isSearchPopupOpened: state.uiState.isSearchPopupOpened,
    isUserConnected: state.userState.isConnected,
    isUserLoaded: state.userState.isLoaded,
    isAdminConnected: state.userState.isAdminConnected,
    userCurrentId: state.userState.currentId,
    userSlug: state.userState.user && state.userState.user.slug,
    currentTopic: state.topicState.currentTopic
}), {
    switchUserPopup,
    switchUserSignup,
    switchUserLogin,
    switchTopicPopup,
    switchSearchPopup,
    fetchTopic
})
export default class HeaderLayout extends React.PureComponent {
    static propTypes = {
        // From connect
        isUserPopupOpened: PropTypes.bool,
        isUserSignupOpened: PropTypes.bool,
        isUserLoginOpened: PropTypes.bool,
        isTopicPopupOpened: PropTypes.bool,
        isSearchPopupOpened: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        userCurrentId: PropTypes.number,
        userSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        switchUserPopup: PropTypes.func,
        switchUserSignup: PropTypes.func,
        switchUserLogin: PropTypes.func,
        switchTopicPopup: PropTypes.func,
        switchSearchPopup: PropTypes.func,
        fetchTopic: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSignupClick = (event) => {
        event.preventDefault();

        this.props.switchUserSignup();
    };

    _handleLoginClick = (event) => {
        event.preventDefault();

        this.props.switchUserLogin();
    };

    _handleTopicClick = (event) => {
        event.preventDefault();

        this.props.switchTopicPopup(!this.props.isTopicPopupOpened);
    };

    _handleSearchClick = (event) => {
        event.preventDefault();

        this.props.switchSearchPopup(!this.props.isSearchPopupOpened);
    };

    render() {
        return (
            <header className="blog-header">
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <ul className="left hide-on-med-and-down">
                                {
                                    this.props.isUserLoaded &&
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
                                    this.props.isUserLoaded &&
                                    <li>
                                        <HomePreferenceHeader/>
                                    </li>
                                }

                                <li>
                                    <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                                    isAdminConnected={this.props.isAdminConnected}
                                                    isOpened={this.props.isUserPopupOpened}
                                                    onUserPopup={this.props.switchUserPopup}
                                                    onSignupClick={this._handleSignupClick}
                                                    onLoginClick={this._handleLoginClick}
                                                    userSlug={this.props.userSlug}/>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <Dialog isOpened={this.props.isTopicPopupOpened}>
                    <TopicModule/>
                </Dialog>

                <div className="blog-search-nav row">
                    <SearchModule isOpened={this.props.isSearchPopupOpened}/>
                </div>

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                <Signup isOpened={this.props.isUserSignupOpened}
                        onModalChange={this.props.switchUserSignup}/>

                <Login isOpened={this.props.isUserLoginOpened}
                       onModalChange={this.props.switchUserLogin}/>
            </header>
        );
    }
}
