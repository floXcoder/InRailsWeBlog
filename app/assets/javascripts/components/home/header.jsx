'use strict';

import Login from '../users/login';
import Signup from '../users/signup';

import UserTopic from '../users/topic';
import UserPreference from '../users/preference';
import SearchModule from '../search/module';
import TagSidebar from '../tags/sidebar';

import HomeSearchHeader from './header/search';
import HomeArticleHeader from './header/article';
import HomeTagHeader from './header/tag';
import HomePreferenceHeader from './header/preference';
import HomeUserHeader from './header/user';
import HomeTopicHeader from './header/topic';

import {Link} from 'react-router';

import {FlatButton, FontIcon, Drawer} from 'material-ui';

export default class HomeHeader extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    state = {
        isMobile: false,
        isTopic: false,
        isSearch: false,
        isTags: false,
        isSettings: false,
        isLogin: false,
        isSignup: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    _handleMobileDrawerClick(event) {
        event.preventDefault();
        this.setState({
            isMobile: !this.state.isMobile
        });
    }

    _handleTopicClick() {
        this.setState({
            isTopic: !this.state.isTopic
        });
    }

    _handleSearchClick() {
        this.setState({
            isSearch: !this.state.isSearch
        });
    }

    _handleTagClick() {
        this.setState({
            isTags: !this.state.isTags
        });
    }

    _handlePreferenceClick() {
        this.setState({
            isSettings: !this.state.isSettings
        });
    }

    _handleLoginClick() {
        this.setState({
            isLogin: true
        });
    }

    _handleSignupClick() {
        this.setState({
            isSignup: true
        });
    }

    render() {
        return (
            <header className="blog-header">
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <Link to="/"
                                  className="brand-logo">
                                {window.parameters.website_name}
                            </Link>

                            <div className="header-mobile hide-on-large-only">
                                <FlatButton className=""
                                            secondary={true}
                                            icon={<FontIcon className="material-icons">menu</FontIcon>}
                                            onTouchTap={this._handleMobileDrawerClick}/>

                                <Drawer docked={false}
                                        width={200}
                                        open={this.state.isMobile}
                                        onRequestChange={(open) => this.setState({isMobile: open})}>
                                    <HomeSearchHeader onSearchClick={this._handleSearchClick}/>

                                    <HomeArticleHeader />

                                    <HomeTagHeader onTagClick={this._handleTagClick}/>

                                    <HomePreferenceHeader onPreferenceClick={this._handlePreferenceClick}/>

                                    <HomeUserHeader onLoginClick={this._handleLoginClick}
                                                    onSignupClick={this._handleSignupClick}/>
                                </Drawer>
                            </div>

                            <div className="header-normal right hide-on-med-and-down">
                                <HomeTopicHeader onTopicClick={this._handleTopicClick}/>

                                <HomeSearchHeader onSearchClick={this._handleSearchClick}/>

                                <HomeArticleHeader />

                                <HomeTagHeader onTagClick={this._handleTagClick}/>

                                <HomePreferenceHeader onPreferenceClick={this._handlePreferenceClick}/>

                                <HomeUserHeader onLoginClick={this._handleLoginClick}
                                                onSignupClick={this._handleSignupClick}/>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="blog-user-pref">
                    <UserPreference isOpened={this.state.isSettings}/>
                </div>

                <div className="blog-search-nav row">
                    <SearchModule isOpened={this.state.isSearch}/>
                </div>

                <div className="blog-sidebar">
                    <TagSidebar isOpened={this.state.isTags}/>
                </div>

                <div id="clipboard-area"
                     className="hidden">
                        <textarea id="clipboard"
                                  title="clipboard"/>
                </div>

                {
                    this.state.isLogin &&
                    <Login isOpened={true}/>
                }

                {
                    this.state.isSignup &&
                    <Signup isOpened={true}/>
                }
            </header>
        );
    }
}
