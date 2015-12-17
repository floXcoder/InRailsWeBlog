'use strict';

var Select = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        options: React.PropTypes.object.isRequired,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        id: React.PropTypes.string,
        onSelectChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            value: null,
            id: null,
            onSelectChange: null
        };
    },

    getInitialState () {
        return {
            value: this.props.value
        };
    },

    componentDidMount () {
        this._initSelect();
    },

    componentDidUpdate () {
        this._initSelect();
    },

    value () {
        return this.state.value;
    },

    _initSelect () {
        let selector = 'select' + (this.props.id ? '#' + this.props.id : '');
        $(selector).material_select();
        $(selector).on('change', this._handleSelectChange);
    },

    _handleSelectChange (event) {
        this.setState({value: event.target.value});
        if(this.props.onSelectChange) {
            this.props.onSelectChange(event.target.value);
        }
        return event;
    },

    render () {
        let SelectOptions = Object.keys(this.props.options).map(function (key) {
            let option = this.props.options[key];
            return (
                <option key={key}
                        value={key}>
                    {option}
                </option>
            );
        }.bind(this));

        return (
            <div className="input-field">
                <select id={this.props.id}
                        value={this.state.value}
                        onChange={this._handleSelectChange}>
                    <option value="default"
                            disabled="true">
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

