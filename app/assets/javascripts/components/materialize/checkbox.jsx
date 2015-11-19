var Checkbox = React.createClass({
    propTypes: {
        onCheckboxChanged: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        id: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            onCheckboxChanged: null,
            id: null
        };
    },

    getInitialState: function() {
        return {
            checked: false,
            disabled: this.props.disabled || false
        };
    },

    onChange: function () {
        this.setState({checked: !this.state.checked});
    },

    render: function () {
        return (
            <div>
                <input ref="checkbox"
                       id={this.props.id}
                       className="filled-in"
                       type="checkbox"
                       checked={this.state.checked}
                       disabled={this.state.disabled}
                       onChange={this.props.onCheckboxChanged || this.onChange}/>
                <label htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Checkbox;

