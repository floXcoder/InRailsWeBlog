'use strict';

import UserActions from '../../actions/userActions';
import UserStore from '../../stores/userStore';
import RadioButtons from '../../components/materialize/radio-buttons';
import SwitchButton from '../../components/materialize/switch-button';

import {
    Menu
} from 'semantic-ui-react';


export default class UserSettings extends Reflux.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onSettingsChange);
    }

    state = {
        activeItem: I18n.t('js.user.settings.article.title'),
        article_display: window.settings.article_display,
        search_highlight: window.settings.search_highlight,
        search_operator: window.settings.search_operator,
        search_exact: window.settings.search_exact
    };

    onSettingsChange(userData) {
        let userSettings = userData.settings;
        if (!$.isEmpty(userSettings)) {
            let newState = {};

            if (userSettings.article_display) {
                newState.article_display = userSettings.article_display;
            }
            if (userSettings.search_highlight) {
                newState.search_highlight = userSettings.search_highlight;
            }
            if (userSettings.search_operator) {
                newState.search_operator = userSettings.search_operator;
            }
            if (userSettings.search_exact) {
                newState.search_exact = userSettings.search_exact;
            }

            this.setState(newState);
        }
    }

    handleItemClick = (event, {name}) => {
        this.setState({
            activeItem: name
        });
    };

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
        const {activeItem} = this.state;

        return (
            <div>
                <Menu pointing={true}
                      secondary={true}>
                    <Menu.Item name={I18n.t('js.user.settings.article.title')}
                               active={activeItem === I18n.t('js.user.settings.article.title')}
                               onClick={this.handleItemClick}/>
                    <Menu.Item name={I18n.t('js.user.settings.search.title')}
                               active={activeItem === I18n.t('js.user.settings.search.title')}
                               onClick={this.handleItemClick}/>
                </Menu>

                {
                    activeItem === I18n.t('js.user.settings.article.title') &&
                    <div className="row">
                        <div className="col s12">
                            <h6>{I18n.t('js.user.settings.article.display.title')}</h6>
                            <RadioButtons group="articleDisplay"
                                          buttons={I18n.t('js.user.settings.article.display.mode')}
                                          checkedButton={this.state.article_display}
                                          onRadioChanged={this._onDisplayChanged}/>
                        </div>
                    </div>
                }

                {
                    activeItem === I18n.t('js.user.settings.search.title') &&
                    <div className="row">
                        <div className="col s12">
                            <h6>{I18n.t('js.user.settings.search.operator.title')}</h6>
                            <RadioButtons group="searchOperator"
                                          buttons={I18n.t('js.user.settings.search.operator.mode')}
                                          checkedButton={this.state.search_operator}
                                          onRadioChanged={this._onOperatorSearchChanged}/>
                        </div>
                        <div className="col s12">
                            <SwitchButton id="search-highlight"
                                          title={I18n.t('js.user.settings.search.highlight')}
                                          values={I18n.t('js.checkbox')}
                                          onSwitchChange={this._onHighlightChanged}>
                                {this.state.search_highlight}
                            </SwitchButton>
                        </div>
                        <div className="col s12">
                            <SwitchButton id="search-exact"
                                          title={I18n.t('js.user.settings.search.exact')}
                                          values={I18n.t('js.checkbox')}
                                          onSwitchChange={this._onExactSearchChanged}>
                                {this.state.search_exact}
                            </SwitchButton>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
