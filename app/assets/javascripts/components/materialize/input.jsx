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

                <input ref={this.props.id}
                       id={this.props.id}
                       type="text"
                       minLength={this.props.minLength}
                       maxLength={this.props.maxLength}
                       onBlur={this.props.onBlur}
                       onChange={this.props.onChange} />

                <label htmlFor={this.props.id}
                       className={this.props.classType} >
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Input;

