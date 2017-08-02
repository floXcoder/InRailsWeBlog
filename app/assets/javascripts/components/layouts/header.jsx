'use strict';

import Login from '../users/login';
import Signup from '../users/signup';

// TODO
import UserTopic from '../users/topic';
import UserSettings from '../users/settings';
import SearchModule from '../search/module';

// TODO
import HomeSearchHeader from './header/search';
import HomeArticleHeader from './header/article';
import HomeTagHeader from './header/tag';
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

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    state = {
        isShowingSignup: true,
        isShowingLogin: true,

        isTopic: false,
        isSearch: false,
        isTags: false,
        isSettings: false
    };

    componentDidMount() {
        // TODO
        // $(ReactDOM.findDOMNode(this)).find('.dropdown-button').dropdown({
        //     hover: false,
        //     belowOrigin: true
        // });

        // TODO
        // log.info($app)
        // log.info($app.isUserConnected())
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

    _handleTopicClick = () => {
        this.setState({
            isTopic: !this.state.isTopic
        });
    };

    _handleSearchClick = () => {
        this.setState({
            isSearch: !this.state.isSearch
        });
    };

    _handleTagClick = () => {
        this.setState({
            isTags: !this.state.isTags
        });
    };

    _handlePreferenceClick = () => {
        this.setState({
            isSettings: !this.state.isSettings
        });
    };

    render() {
        return (
            <header className="blog-header">
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <div className="header-normal left hide-on-med-and-down">
                                <HomeTopicHeader router={this.props.router}
                                                 onTopicClick={this.props.onReloadPage}/>
                            </div>

                            <div className="center-align">
                                <a className="brand-logo"
                                   href="/">
                                    {I18n.t('js.views.header.title')}
                                </a>
                            </div>

                            <div className="header-normal right hide-on-med-and-down">
                                <HomeUserHeader onLoginClick={this._handleLoginClick}
                                                onSignupClick={this._handleSignupClick}/>
                            </div>

                            <HomeSearchHeader onSearchClick={this._handleSearchClick}/>

                            <HomeTagHeader onTagClick={this._handleTagClick}/>

                            <HomePreferenceHeader onPreferenceClick={this._handlePreferenceClick}/>

                            <HomeArticleHeader/>
                        </div>
                    </nav>
                </div>

                {
                    // TODO
                    // <div className="blog-user-pref">
                    //    <UserSettings isOpened={this.state.isSettings}/>
                    // </div>
                }

                <div className="blog-search-nav row">
                    <SearchModule isOpened={this.state.isSearch}/>
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
