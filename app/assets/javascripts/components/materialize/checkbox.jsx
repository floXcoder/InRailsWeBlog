var Checkbox = React.createClass({
    getInitialState: function() {
        return {
            checked: false
        };
    },

    render: function () {
        return (
            <div>
                <input ref="checkbox"
                       id={this.props.id}
                       className="filled-in"
                       type="checkbox"
                       checked={this.state.checked}
                       onChange={this.props.onCheckboxChanged}/>
                <label htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Checkbox;

