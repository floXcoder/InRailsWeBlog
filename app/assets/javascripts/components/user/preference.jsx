var UserActions = require('../../actions/userAction');
var UserStore = require('../../stores/userStore');
var RadioButtons = require('../../components/materialize/radioButtons');
var Checkbox = require('../../components/materialize/checkbox');

var UserPreference = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onChangePreference')
    ],

    getInitialState: function () {
        return {
            article_display: 'inline',
            search_highlight: true,
            search_operator: 'and',
            search_exact: false,
            $userPrefDiv: null
        };
    },

    componentDidMount: function () {
        $('a#toggle-user-pref').click(function () {
            this.state.$userPrefDiv = $('.blog-user-pref');

            this.state.$userPrefDiv.is(":visible") ? this.state.$userPrefDiv.slideUp() : this.state.$userPrefDiv.slideDown(function () {
                $('.user-pref-collapsible').collapsible({
                    accordion: true
                });
            }.bind(this));

            this.state.$userPrefDiv.mouseleave(function() {
                this.state.$userPrefDiv.slideUp();
            }.bind(this));

            return false;
        }.bind(this));
    },

    onChangePreference(userStore) {
        var userPreferences = userStore.preferences;
        if (!$utils.isEmpty(userPreferences)) {
            var newState = {};

            if (userPreferences.article_display) {
                newState.article_display = userPreferences.article_display;
            }
            if (userPreferences.search_highlight) {
                newState.search_highlight = userPreferences.search_highlight !== 'false';
            }
            if (userPreferences.search_operator) {
                newState.search_operator = userPreferences.search_operator;
            }
            if (userPreferences.search_exact) {
                newState.search_exact = userPreferences.search_exact !== 'false';
            }

            this.setState(newState);
        }
    },

    _onDisplayChanged: function (event) {
        var article_display = event.target.id;
        this.setState({article_display: event.target.id});
        UserActions.changeDisplay(article_display);
    },

    _onHighlightChanged: function (event) {
        var search_highlight = this.refs.highlight.refs.checkbox.checked;
        this.setState({search_highlight: search_highlight});
        UserActions.changeSearchOptions({search_highlight: search_highlight ? 'true' : 'false'});
    },

    _onOperatorSearchChanged: function (event) {
        var search_operator = event.target.id;
        this.setState({search_operator: search_operator});
        UserActions.changeSearchOptions({search_operator: search_operator});
    },

    _onExactSearchChanged: function (event) {
        var search_exact = this.refs.exact.refs.checkbox.checked;
        this.setState({search_exact: search_exact});
        UserActions.changeSearchOptions({search_exact: search_exact ? 'true' : 'false'});
    },

    render: function () {
        return (
            <div className="container center">
                <ul data-collapsible="accordion" className="collapsible popout user-pref-collapsible">
                    <li>
                        <div className="collapsible-header"><i className="material-icons">list</i>
                            {I18n.t('js.user.preferences.display.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s12">
                                    <h6>{I18n.t('js.user.preferences.display.title')}</h6>
                                    <RadioButtons group="userDisplay"
                                                  buttons={I18n.t('js.user.preferences.display.mode')}
                                                  checkedButton={this.state.article_display}
                                                  onRadioChanged={this._onDisplayChanged}/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header"><i className="material-icons">view_modules</i>
                            {I18n.t('js.user.preferences.search.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.operator.title')}</h6>
                                    <RadioButtons group="userSearchOperator"
                                                  buttons={I18n.t('js.user.preferences.search.operator.mode')}
                                                  checkedButton={this.state.search_operator}
                                                  onRadioChanged={this._onOperatorSearchChanged}/>
                                </div>
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.highlight')}</h6>
                                    <Checkbox ref="highlight"
                                              values={I18n.t('js.checkbox')}
                                              checked={this.state.search_highlight}
                                              onCheckboxChanged={this._onHighlightChanged}/>
                                </div>
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.exact')}</h6>
                                    <Checkbox ref="exact"
                                              values={I18n.t('js.checkbox')}
                                              checked={this.state.search_exact}
                                              onCheckboxChanged={this._onExactSearchChanged}/>
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
