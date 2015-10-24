var Input = React.createClass({
    _displayIcon: function () {
        if (this.props.icon) {
            return (
                <i className="material-icons prefix">{this.props.icon}</i>
            )
        }
    },

    render: function () {
        return (
            <div className="input-field">
                { this._displayIcon() }
                <input id={this.props.id} type="text" ref={this.props.id} onBlur={this.props.onBlur}/>
                <label htmlFor={this.props.id} className={this.props.classType}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Input;

