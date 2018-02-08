'use strict';

import {
    switchUserPopup,
    switchUserSignup,
    switchUserLogin,
    switchTopicPopup,
    fetchTopic
} from '../../actions';

import Dialog from '../theme/dialog';

import Login from '../users/login';
import Signup from '../users/signup';

import TopicModule from '../topic/module';

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
    currentUserId: state.userState.currentId,
    userSlug: state.userState.user && state.userState.user.slug,
    currentTopic: state.topicState.currentTopic
}), {
    switchUserPopup,
    switchUserSignup,
    switchUserLogin,
    switchTopicPopup,
    fetchTopic
})
export default class HeaderLayout extends React.PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired,
        hasSearch: PropTypes.bool.isRequired,
        onSearchOpen: PropTypes.func.isRequired,
        onSearchClose: PropTypes.func.isRequired,
        children: PropTypes.array.isRequired,
        // From connect
        isUserPopupOpened: PropTypes.bool,
        isUserSignupOpened: PropTypes.bool,
        isUserLoginOpened: PropTypes.bool,
        isTopicPopupOpened: PropTypes.bool,
        isSearchPopupOpened: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        userSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        switchUserPopup: PropTypes.func,
        switchUserSignup: PropTypes.func,
        switchUserLogin: PropTypes.func,
        switchTopicPopup: PropTypes.func,
        fetchTopic: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(document).keyup(function (event) {
            if (event.which === '27') {
                this.props.onSearchClose();
            }
        }.bind(this));
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

    render() {
        return (
            <header className="blog-header animate-search">
                <div className="navbar-fixed">
                    <nav className="header-nav">
                        <div className="nav-wrapper">
                            <ul className="left">
                                {
                                    this.props.isUserLoaded &&
                                    <li>
                                        <HomeTopicHeader currentTopicName={this.props.currentTopic.name}
                                                         onTopicClick={this._handleTopicClick}/>
                                    </li>
                                }
                            </ul>

                            <a className="brand-logo center"
                               href="/">
                                {I18n.t('js.views.header.title')}
                            </a>

                            <HomeSearchHeader hasSearch={this.props.hasSearch}
                                              onFocus={this.props.onSearchOpen}
                                              onClose={this.props.onSearchClose}/>

                            <ul className="right">
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

                <div className={classNames('search-module', {
                    'is-visible': this.props.hasSearch
                })}>
                    {
                        this.props.hasSearch &&
                        this.props.children
                    }
                </div>

                <Dialog isOpened={this.props.isTopicPopupOpened}>
                    <TopicModule history={this.props.history}/>
                </Dialog>

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
