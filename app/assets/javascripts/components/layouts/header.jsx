'use strict';

import {
    Link
} from 'react-router-dom';

import {
    ImmutableLoadingBar as LoadingBar
} from 'react-redux-loading-bar';

import {
    getLocalData
} from '../../middlewares/localStorage';

import {
    switchUserSignup,
    switchUserLogin,
    switchUserPreference,
    switchTopicPopup,
    fetchTopic
} from '../../actions';

import {
    getCurrentTagSlugs
} from '../../selectors';

import Dropdown from '../theme/dropdown';

import Login from '../users/login';
import Signup from '../users/signup';
import Preference from '../users/preference';

import TopicModule from '../topic/module';

import HomeSearchHeader from './header/search';
import HomeTopicHeader from './header/topic';
import HomeBookmarkHeader from './header/bookmark';
import HomeArticleHeader from './header/article';
import HomeUserHeader from './header/user';

@connect((state) => ({
    isUserSignupOpened: state.uiState.isUserSignupOpened,
    isUserLoginOpened: state.uiState.isUserLoginOpened,
    isUserPreferenceOpened: state.uiState.isUserPreferenceOpened,
    isTopicPopupOpened: state.uiState.isTopicPopupOpened,
    isSearchPopupOpened: state.uiState.isSearchPopupOpened,
    isUserConnected: state.userState.isConnected,
    isUserLoaded: state.userState.isLoaded,
    isAdminConnected: state.userState.isAdminConnected,
    currentUserId: state.userState.currentId,
    userSlug: state.userState.user && state.userState.user.slug,
    currentTopic: state.topicState.currentTopic,
    currentTagSlugs: getCurrentTagSlugs(state)
}), {
    switchUserSignup,
    switchUserLogin,
    switchUserPreference,
    switchTopicPopup,
    fetchTopic
})
export default class HeaderLayout extends React.PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        hasSearch: PropTypes.bool.isRequired,
        onSearchOpen: PropTypes.func.isRequired,
        onSearchClose: PropTypes.func.isRequired,
        children: PropTypes.array.isRequired,
        // From connect
        isUserSignupOpened: PropTypes.bool,
        isUserLoginOpened: PropTypes.bool,
        isUserPreferenceOpened: PropTypes.bool,
        isTopicPopupOpened: PropTypes.bool,
        isSearchPopupOpened: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        userSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        currentTagSlugs: PropTypes.array,
        switchUserSignup: PropTypes.func,
        switchUserLogin: PropTypes.func,
        switchUserPreference: PropTypes.func,
        switchTopicPopup: PropTypes.func,
        fetchTopic: PropTypes.func
    };

    constructor(props) {
        super(props);

        // Check if temporary article in local storage
        const temporaryArticle = getLocalData('article-temporary');
        if (temporaryArticle && temporaryArticle.length > 0) {
            this.state.hasTemporaryArticle = true;
        }
    }

    state = {
        hasTemporaryArticle: false
    };

    componentDidMount() {
        $(document).keyup((event) => {
            if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                this.props.onSearchClose();
            }
        });
    }

    _handleSignupClick = (event) => {
        event.preventDefault();

        this.props.switchUserSignup();
    };

    _handleLoginClick = (event) => {
        event.preventDefault();

        this.props.switchUserLogin();
    };

    _handlePreferenceClick = (event) => {
        event.preventDefault();

        this.props.switchUserPreference();
    };

    _handleTopicSwitch = (event) => {
        event.preventDefault();

        this.props.switchTopicPopup(!this.props.isTopicPopupOpened);
    };

    render() {
        return (
            <header className="blog-header animate-search">
                <div className="navbar-fixed">
                    <nav className="header-nav">
                        <LoadingBar showFastActions={true}
                                    style={{backgroundColor: '#0d5ca0', height: '2px'}}/>

                        <div className="nav-wrapper">
                            <ul className="left">
                                {
                                    (this.props.isUserLoaded && this.props.currentTopic) &&
                                    <li>
                                        <Dropdown
                                            button={<HomeTopicHeader currentTopicName={this.props.currentTopic.name}
                                                                     onTopicClick={this._handleTopicSwitch}/>}
                                            isDefaultOpen={false}
                                            isForceOpen={this.props.isTopicPopupOpened}
                                            onClose={this._handleTopicSwitch}
                                            position="bottom left"
                                            horizontalOffset={10}
                                            isFixed={true}
                                            isClosingOnInsideClick={false}
                                            isHidingOnScroll={false}
                                            isButton={false}
                                            hasArrow={false}>
                                            <TopicModule history={this.props.history}/>
                                        </Dropdown>
                                    </li>
                                }
                            </ul>

                            <Link className="brand-logo center"
                                  to="/">
                                <h1>
                                    {I18n.t('js.views.header.title')}
                                </h1>
                            </Link>

                            <HomeSearchHeader hasSearch={this.props.hasSearch}
                                              onFocus={this.props.onSearchOpen}
                                              onClose={this.props.onSearchClose}/>

                            <ul className="right">
                                <li>
                                    <HomeBookmarkHeader/>
                                </li>

                                <li>
                                    <HomeArticleHeader parentTagSlug={this.props.params.parentTagSlug || this.props.params.tagSlug || this.props.currentTagSlugs.first()}
                                                       childTagSlug={this.props.params.childTagSlug}
                                                       hasTemporaryArticle={this.state.hasTemporaryArticle}/>
                                </li>

                                <li>
                                    <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                                    isAdminConnected={this.props.isAdminConnected}
                                                    onSignupClick={this._handleSignupClick}
                                                    onLoginClick={this._handleLoginClick}
                                                    onPreferenceClick={this._handlePreferenceClick}
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

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                <Signup isOpened={this.props.isUserSignupOpened}
                        onModalChange={this.props.switchUserSignup}/>

                <Login isOpened={this.props.isUserLoginOpened}
                       onModalChange={this.props.switchUserLogin}/>

                <Preference isOpened={this.props.isUserPreferenceOpened}
                            onModalChange={this.props.switchUserPreference}/>
            </header>
        );
    }
}
