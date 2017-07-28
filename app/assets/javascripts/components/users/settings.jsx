'use strict';

import UserActions from '../../actions/userActions';
import UserStore from '../../stores/userStore';
import RadioButtons from '../../components/materialize/radio-buttons';
import SwitchButton from '../../components/materialize/switch-button';

// TODO : replace it
export default class UserSettings extends Reflux.Component {
    static propTypes = {
        isOpened: React.PropTypes.bool
    };

    static defaultProps = {
        isOpened: false
    };

    state = {
        isOpened: this.props.isOpened,
        article_display: window.parameters.article_display,
        search_highlight: window.parameters.search_highlight,
        search_operator: window.parameters.search_operator,
        search_exact: window.parameters.search_exact
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onSettingsChange);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.isOpened != nextProps.isOpened || !_.isEqual(this.state, nextState));
    }

    onSettingsChange(userData) {
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
    }

    _onDisplayChanged = (event) => {
        let article_display = event.target.id;
        this.setState({article_display: event.target.id});
        UserActions.updateUserPreference({displayType: article_display});
    };

    _onHighlightChanged = (event) => {
        let search_highlight = this.refs.searchHighlight.value();
        this.setState({search_highlight: search_highlight});
        UserActions.updateUserPreference({search_highlight: !search_highlight});
    };

    _onOperatorSearchChanged = (event) => {
        let search_operator = event.target.id;
        this.setState({search_operator: search_operator});
        UserActions.updateUserPreference({search_operator: search_operator});
    };

    _onExactSearchChanged = (event) => {
        let search_exact = this.refs.searchExact.value();
        this.setState({search_exact: search_exact});
        UserActions.updateUserPreference({search_exact: !search_exact});
    };

    render() {
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
                                    <SwitchButton ref="searchHighlight"
                                            id="search-highlight"
                                            title={I18n.t('js.user.settings.search.highlight')}
                                            values={I18n.t('js.checkbox')}
                                            onSwitchChange={this._onHighlightChanged}>
                                        {this.state.search_highlight}
                                    </SwitchButton>
                                </div>
                                <div className="col s4">
                                    <SwitchButton ref="searchExact"
                                            id="search-exact"
                                            title={I18n.t('js.user.settings.search.exact')}
                                            values={I18n.t('js.checkbox')}
                                            onSwitchChange={this._onExactSearchChanged}>
                                        {this.state.search_exact}
                                    </SwitchButton>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </Drawer>
        );
    }
}
