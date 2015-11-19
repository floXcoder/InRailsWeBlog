var Input = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        classType: React.PropTypes.string,
        icon: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            icon: null,
            minLength: null,
            maxLength: null,
            onBlur: null,
            onChange: null
        };
    },

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

