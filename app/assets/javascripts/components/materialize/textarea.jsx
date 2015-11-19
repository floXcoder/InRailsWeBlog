var Textarea = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            onChange: null
        };
    },

    render: function () {
        return (
            <div className="input-field">
                <textarea id={this.props.id} ref={this.props.id} className="materialize-textarea" onChange={this.props.onChange}/>
                <label htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Textarea;

