var Switch = React.createClass({

    render: function () {
        return (
            <div className="switch">
                <label>
                    {this.props.values.false}
                    <input type="checkbox"
                           ref="checkbox"
                           checked={this.props.checked}
                           onChange={this.props.onCheckboxChanged} />
                    <span className="lever" />
                    {this.props.values.true}
                </label>
            </div>
        );
    }
});

module.exports = Switch;

