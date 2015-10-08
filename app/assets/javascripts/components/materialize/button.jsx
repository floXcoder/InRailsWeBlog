var Button = React.createClass({
    getInitialState: function() {
        return {
            disabled: true
        };
    },

    _displayIcon: function () {
        if (this.props.icon) {
            return (
                <i className="material-icons right">{this.props.icon}</i>
            )
        }
    },

    render: function () {
        return (
            <button className="btn waves-effect waves-light" type="submit" method="post" disabled={this.state.disabled}>
                { this._displayIcon() }
                {this.props.children}
            </button>
        );
    }
});

module.exports = Button;
