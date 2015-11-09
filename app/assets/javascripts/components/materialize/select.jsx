var Select = React.createClass({
    getInitialState: function () {
        return {
            value: this.props.value
        };
    },

    componentDidMount: function () {
        var selector = 'select' + (this.props.id ? '#' + this.props.id : '');
        $(selector).material_select();
    },

    componentDidUpdate: function () {
        var selector = 'select' + (this.props.id ? '#' + this.props.id : '');
        $(selector).material_select();
    },

    handleChange: function (event) {
        this.setState({value: event.target.value});
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
                <select id={this.props.id} value={this.state.value} onChange={this.handleChange} >
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

