var Button = React.createClass({
    getInitialState: function() {
        return {
            disabled: true,
            tooltip: this.props.tooltip
        };
    },

    _displayIcon: function () {
        if (this.props.icon) {
            return (
                <i className="material-icons right">{this.props.icon}</i>
            )
        }
    },

    componentDidMount: function () {
        if(this.state.tooltip) {
            $('.tooltipped').tooltip();
        }
    },

    componentDidUpdate: function () {
        if(this.state.tooltip) {
            $('.tooltipped').tooltip();
        }
    },

    render: function () {
        if(this.state.tooltip) {
            return (
                <button className="btn waves-effect waves-light tooltipped"
                        type="submit"
                        method="post"
                        onClick={this.props.onClickButton}
                        data-position="bottom"
                        data-delay="50"
                        data-tooltip={this.state.tooltip}
                        disabled={this.state.disabled} >
                    { this._displayIcon() }
                    {this.props.children}
                </button>
            );
        } else {
            return (
                <button className="btn waves-effect waves-light"
                        type="submit"
                        method="post"
                        onClick={this.props.onClickButton}
                        disabled={this.state.disabled} >
                    { this._displayIcon() }
                    {this.props.children}
                </button>
            );
        }
    }
});

module.exports = Button;
