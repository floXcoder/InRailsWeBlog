var UserActions = require('../../actions/userAction');
var RadioButtons = require('../../components/materialize/radioButtons');

var UserDisplay = React.createClass({
    getInitialState: function () {
        return {
            displayType: 'inline'
        };
    },

    _onDisplayChanged: function (event) {
        var displayType = event.target.id;

        if (displayType === "inline") {
            this.setState({
                displayType: "inline"
            })
        } else if (displayType === "separated") {
            this.setState({
                displayType: "separated"
            })
        }
        UserActions.changeDisplay(displayType);
    },

    render: function () {
        return (
            <ul className="collection without-border">
                <li className="collection-header">
                    <h5>{I18n.t('js.user.display_mode')}</h5>
                </li>
                <RadioButtons group="userDisplayRadioGroup"
                              buttons={I18n.t('js.user.display')}
                              checkedButton={this.state.displayType} onRadioChanged={this._onDisplayChanged}/>
            </ul>
        );
    }
});

module.exports = UserDisplay;
