'use strict';

const UserActions = require('../../actions/userActions');
const UserStore = require('../../stores/userStore');
const RadioButtons = require('../../components/materialize/radio-buttons');
const Switch = require('../../components/materialize/switch');

import Drawer from 'material-ui/Drawer';

var UserPreference = React.createClass({
    propTypes: {
        isOpened: React.PropTypes.bool
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onPreferenceChange')
    ],

    getDefaultProps () {
        return {
            isOpened: false
        };
    },

    getInitialState () {
        return {
            isOpened: this.props.isOpened,
            article_display: window.parameters.article_display,
            search_highlight: window.parameters.search_highlight,
            search_operator: window.parameters.search_operator,
            search_exact: window.parameters.search_exact
        };
    },

    componentDidMount () {
    },

    shouldComponentUpdate (nextProps, nextState) {
        return (this.props.isOpened != nextProps.isOpened || !_.isEqual(this.state, nextState));
    },

    onPreferenceChange(userData) {
        let usersettings = userData.settings;
        if (!$.isEmpty(usersettings)) {
            let newState = {};

            if (usersettings.article_display) {
                newState.article_display = usersettings.article_display;
            }
            if (usersettings.search_highlight) {
                newState.search_highlight = usersettings.search_highlight;
            }
            if (usersettings.search_operator) {
                newState.search_operator = usersettings.search_operator;
            }
            if (usersettings.search_exact) {
                newState.search_exact = usersettings.search_exact;
            }

            this.setState(newState);
        }
    },

    _onDisplayChanged (event) {
        let article_display = event.target.id;
        this.setState({article_display: event.target.id});
        UserActions.updateUserPreference({displayType: article_display});
    },

    _onHighlightChanged (event) {
        let search_highlight = this.refs.searchHighlight.value();
        this.setState({search_highlight: search_highlight});
        UserActions.updateUserPreference({search_highlight: !search_highlight});
    },

    _onOperatorSearchChanged (event) {
        let search_operator = event.target.id;
        this.setState({search_operator: search_operator});
        UserActions.updateUserPreference({search_operator: search_operator});
    },

    _onExactSearchChanged (event) {
        let search_exact = this.refs.searchExact.value();
        this.setState({search_exact: search_exact});
        UserActions.updateUserPreference({search_exact: !search_exact});
    },

    render () {
        const isOpened = this.props.isOpened;

        return (
            <Drawer width={300}
                    openSecondary={true}
                    docked={false}
                    open={isOpened}
                    onRequestChange={(open) => this.setState({isOpened: open})}>
                <ul data-collapsible="accordion"
                    className="collapsible popout user-pref-collapsible">
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons">list</i>
                            {I18n.t('js.user.settings.article.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s6">
                                    <h6>{I18n.t('js.user.settings.article.display.title')}</h6>
                                    <RadioButtons group="articleDisplay"
                                                  buttons={I18n.t('js.user.settings.article.display.mode')}
                                                  checkedButton={this.state.article_display}
                                                  onRadioChanged={this._onDisplayChanged}/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons">view_modules</i>
                            {I18n.t('js.user.settings.search.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.settings.search.operator.title')}</h6>
                                    <RadioButtons group="searchOperator"
                                                  buttons={I18n.t('js.user.settings.search.operator.mode')}
                                                  checkedButton={this.state.search_operator}
                                                  onRadioChanged={this._onOperatorSearchChanged}/>
                                </div>
                                <div className="col s4">
                                    <Switch ref="searchHighlight"
                                            id="search-highlight"
                                            title={I18n.t('js.user.settings.search.highlight')}
                                            values={I18n.t('js.checkbox')}
                                            onSwitchChange={this._onHighlightChanged}>
                                        {this.state.search_highlight}
                                    </Switch>
                                </div>
                                <div className="col s4">
                                    <Switch ref="searchExact"
                                            id="search-exact"
                                            title={I18n.t('js.user.settings.search.exact')}
                                            values={I18n.t('js.checkbox')}
                                            onSwitchChange={this._onExactSearchChanged}>
                                        {this.state.search_exact}
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </Drawer>
        );
    }
});


module.exports = UserPreference;
