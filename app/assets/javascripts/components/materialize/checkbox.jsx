'use strict';

var classNames = require('classnames');

var Checkbox = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array
        ]),
        onCheckboxChange: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        id: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            onCheckboxChanged: null,
            id: null
        };
    },

    getInitialState () {
        return {
            checked: false,
            disabled: this.props.disabled || false,
            valid: true
        };
    },

    toggleCheckbox () {
        this.setState({checked: !this.state.checked});
        return !this.state.checked;
    },

    isChecked () {
      return this.state.checked;
    },

    setValid () {
        this.setState({
            valid: true
        });
    },

    setInvalid () {
        this.setState({
            valid: false
        });
    },

    render () {
        let checkboxClass = classNames({
            'filled-in': true,
            'invalid': !this.state.valid
        });

        return (
            <div>
                <input ref={this.props.id}
                       id={this.props.id}
                       className={checkboxClass}
                       type="checkbox"
                       checked={this.state.checked}
                       disabled={this.state.disabled}
                       onChange={this.props.onCheckboxChange || this.toggleCheckbox}/>
                <label htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Checkbox;

