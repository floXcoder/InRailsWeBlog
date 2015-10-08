var Select = React.createClass({

    componentDidMount: function () {
        $('select').material_select();
    },

    render: function () {
        var SelectOptions = Object.keys(this.props.options).map(function (key) {
            var option = this.props.options[key];
            return (
                <option key={key} value={key}>
                    {option}
                </option>
            );
        }.bind(this));

        return (
            <div className="input-field">
                <select defaultValue="default">
                    <option value="default" disabled="true">
                        {this.props.title}
                    </option>
                    {SelectOptions}
                </select>
                <label>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Select;

