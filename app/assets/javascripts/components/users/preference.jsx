'use strict';

var UserActions = require('../../actions/userActions');
var UserStore = require('../../stores/userStore');
var RadioButtons = require('../../components/materialize/radioButtons');
var Switch = require('../../components/materialize/switch');

var UserPreference = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onChangePreference')
    ],

    getInitialState () {
        return {
            article_display: window.parameters.article_display,
            multi_language: window.parameters.multi_language,
            search_highlight: window.parameters.search_highlight,
            search_operator: window.parameters.search_operator,
            search_exact: window.parameters.search_exact
        };
    },

    componentDidMount () {
        $('a#toggle-user-pref').click(function (event) {
            event.preventDefault();

            var $userPrefDiv = $('.blog-user-pref');

            if ($userPrefDiv.is(":visible")) {
                $userPrefDiv.slideUp();
            } else {
                $('#toggle-navbar').sideNav('hide');
                $userPrefDiv.slideDown(150);
            }
            $userPrefDiv.mouseleave(() => $userPrefDiv.slideUp());

            return false;
        }.bind(this));
    },

    onChangePreference(userData) {
        let userPreferences = userData.preferences;
        if (!$.isEmpty(userPreferences)) {
            let newState = {};

            if (userPreferences.article_display) {
                newState.article_display = userPreferences.article_display;
            }
            if (userPreferences.multi_language) {
                newState.multi_language = userPreferences.multi_language;
            }
            if (userPreferences.search_highlight) {
                newState.search_highlight = userPreferences.search_highlight;
            }
            if (userPreferences.search_operator) {
                newState.search_operator = userPreferences.search_operator;
            }
            if (userPreferences.search_exact) {
                newState.search_exact = userPreferences.search_exact;
            }

            this.setState(newState);
        }
    },

    _onDisplayChanged (event) {
        let article_display = event.target.id;
        this.setState({article_display: event.target.id});
        UserActions.changeDisplay(article_display);
    },

    _onMultiLanguageChanged (event) {
        let multi_language = this.refs.multiLanguage.value();
        this.setState({multi_language: multi_language});
        UserActions.changeForm({multi_language: !multi_language});
    },

    _onHighlightChanged (event) {
        let search_highlight = this.refs.searchHighlight.value();
        this.setState({search_highlight: search_highlight});
        UserActions.changeSearchOptions({search_highlight: !search_highlight});
    },

    _onOperatorSearchChanged (event) {
        let search_operator = event.target.id;
        this.setState({search_operator: search_operator});
        UserActions.changeSearchOptions({search_operator: search_operator});
    },

    _onExactSearchChanged (event) {
        let search_exact = this.refs.searchExact.value();
        this.setState({search_exact: search_exact});
        UserActions.changeSearchOptions({search_exact: !search_exact});
    },

    render () {
        return (
            <div className="container center">
                <ul data-collapsible="accordion"
                    className="collapsible popout user-pref-collapsible">
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons">list</i>
                            {I18n.t('js.user.preferences.article.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s6">
                                    <h6>{I18n.t('js.user.preferences.article.display.title')}</h6>
                                    <RadioButtons group="articleDisplay"
                                                  buttons={I18n.t('js.user.preferences.article.display.mode')}
                                                  checkedButton={this.state.article_display}
                                                  onRadioChanged={this._onDisplayChanged}/>
                                </div>
                                <div className="col s6">
                                    <Switch ref="multiLanguage"
                                            id="multi-language"
                                            values={I18n.t('js.checkbox')}
                                            checked={this.state.multi_language}
                                            onSwitchChange={this._onMultiLanguageChanged}>
                                        {I18n.t('js.user.preferences.article.multi_language.title')}
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons">view_modules</i>
                            {I18n.t('js.user.preferences.search.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.operator.title')}</h6>
                                    <RadioButtons group="searchOperator"
                                                  buttons={I18n.t('js.user.preferences.search.operator.mode')}
                                                  checkedButton={this.state.search_operator}
                                                  onRadioChanged={this._onOperatorSearchChanged}/>
                                </div>
                                <div className="col s4">
                                    <Switch ref="searchHighlight"
                                            id="search-highlight"
                                            values={I18n.t('js.checkbox')}
                                            checked={this.state.search_highlight}
                                            onSwitchChange={this._onHighlightChanged}>
                                        {I18n.t('js.user.preferences.search.highlight')}
                                    </Switch>
                                </div>
                                <div className="col s4">
                                    <Switch ref="searchExact"
                                            id="search-exact"
                                            values={I18n.t('js.checkbox')}
                                            checked={this.state.search_exact}
                                            onSwitchChange={this._onExactSearchChanged}>
                                        {I18n.t('js.user.preferences.search.exact')}
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
});


module.exports = UserPreference;
