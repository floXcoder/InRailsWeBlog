'use strict';

import ModalHOC from '../../hoc/modal';

import Login from '../users/login';
import Signup from '../users/signup';

import TopicModule from '../topic/module';

import SearchModule from '../search/module';

import HomeSearchHeader from './header/search';
import HomeArticleHeader from './header/article';
import HomePreferenceHeader from './header/preference';
import HomeUserHeader from './header/user';
import HomeTopicHeader from './header/topic';

import {
    Link
} from 'react-router-dom';

export default class HeaderLayout extends React.PureComponent {
    static propTypes = {
        router: PropTypes.object.isRequired,
        onReloadPage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        isUserConnected: $app.isUserConnected(),
        isShowingSignup: true,
        isShowingLogin: true,
        isTopicOpened: false,
        isSearchOpened: false
    };

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

    _handleTopicClick = (event, isUpdate) => {
        event.preventDefault();

        // if (isUpdate && this.props.onReloadPage) {
        //     this.props.onReloadPage();
        // }

        this.setState({
            isTopicOpened: !this.state.isTopicOpened
        });
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
                                    this.state.isUserConnected &&
                                    <li>
                                        <HomeTopicHeader onTopicClick={this._handleTopicClick}/>
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
                                    <HomeArticleHeader router={this.props.router}/>
                                </li>


                                {
                                    this.state.isUserConnected &&
                                    <li>
                                        <HomePreferenceHeader />
                                    </li>
                                }


                                <li>
                                    <HomeUserHeader isUserConnected={$app.isUserConnected()}
                                                    isAdminConnected={$app.isAdminConnected()}
                                                    onLoginClick={this._handleLoginClick}
                                                    onSignupClick={this._handleSignupClick}/>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <ModalHOC isOpened={this.state.isTopicOpened}>
                    <TopicModule router={this.props.router}
                                 onTopicChange={this._handleTopicClick}/>
                </ModalHOC>

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
