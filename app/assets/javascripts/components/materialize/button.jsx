"use strict";

var Button = React.createClass({
    propTypes: {
        onClickButton: React.PropTypes.func,
        tooltip: React.PropTypes.string,
        icon: React.PropTypes.string,
        id: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            onClickButton: null,
            tooltip: null,
            icon: null,
            id: null
        };
    },

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

    componentDidMount: function () {
        if(this.state.tooltip) {
            var selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    componentDidUpdate: function () {
        if(this.props.tooltip) {
            var selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    render: function () {
        if(this.props.tooltip) {
            return (
                <button className="btn waves-effect waves-light tooltipped"
                        id={this.props.id}
                        type="submit"
                        method="post"
                        onClick={this.props.onClickButton}
                        data-position="bottom"
                        data-delay="50"
                        data-tooltip={this.props.tooltip}
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
