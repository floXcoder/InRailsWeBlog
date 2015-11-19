var Select = React.createClass({
    propTypes: {
        options: React.PropTypes.object.isRequired,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        id: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            value: null,
            id: null
        };
    },

    getInitialState: function () {
        return {
            value: this.props.value
        };
    },

    componentDidMount: function () {
        this._initSelect();
    },

    componentDidUpdate: function () {
        this._initSelect();
    },

    _initSelect: function() {
        var selector = 'select' + (this.props.id ? '#' + this.props.id : '');
        $(selector).material_select();
        $(selector).on('change', this._handleSelectChange);
    },

    _handleSelectChange: function (event) {
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
                <select id={this.props.id} value={this.state.value} onChange={this._handleSelectChange}>
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

