'use strict';

var Switch = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        values: React.PropTypes.object.isRequired,
        checked: React.PropTypes.bool,
        onSwitchChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            checked: false,
            onCheckboxChanged: null
        };
    },

    getInitialState () {
        return {
            checked: this.props.checked
        };
    },

    value () {
        return this.state.checked;
    },

    setValue (value) {
        this.state.checked = value;
    },

    _handleSwitchChange (event) {
        this.setState({checked: !this.state.checked});
        if(this.props.onSwitchChange) {
            this.props.onSwitchChange(!this.state.checked);
        }
        return event;
    },

    render () {
        return (
            <div className="switch">
                <h6>
                    {this.props.children}
                </h6>
                <label>
                    {this.props.values.false}
                    <input ref={this.props.id}
                           id={this.props.id}
                           type="checkbox"
                           checked={this.state.checked}
                           onChange={this._handleSwitchChange} />
                    <span className="lever" />
                    {this.props.values.true}
                </label>
            </div>
        );
    }
});

module.exports = Switch;

