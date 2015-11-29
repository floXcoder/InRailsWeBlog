'use strict';

var RadioButtons = React.createClass({
    propTypes: {
        buttons: React.PropTypes.object.isRequired,
        group: React.PropTypes.string.isRequired,
        checkedButton: React.PropTypes.string,
        onRadioChanged: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            checkedButton: null,
            onRadioChanged: null
        };
    },

    getInitialState () {
        return {
        };
    },

    render () {
        let radioButtons = Object.keys(this.props.buttons).map(function (key) {
            let button = this.props.buttons[key];
            return (
                <div key={key}>
                    <input type="radio" id={key} name={this.props.group} checked={this.props.checkedButton === key}
                           onChange={this.props.onRadioChanged}/>
                    <label htmlFor={key}>
                        {button}
                    </label>
                </div>
            );
        }.bind(this));

        return (
            <div>
                {radioButtons}
            </div>
        );
    }
});

module.exports = RadioButtons;

