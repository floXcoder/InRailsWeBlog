var Textarea = React.createClass({
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

