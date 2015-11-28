'use strict';

var Button = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        onClickButton: React.PropTypes.func,
        tooltip: React.PropTypes.string,
        icon: React.PropTypes.string,
        id: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            onClickButton: null,
            tooltip: null,
            icon: null,
            id: null
        };
    },

    getInitialState() {
        return {
            disabled: true
        };
    },

    componentDidMount () {
        if(this.state.tooltip) {
            let selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    componentDidUpdate () {
        if(this.props.tooltip) {
            let selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    toggleButton() {
        this.setState({disabled: !this.state.disabled});
    },

    renderIcon () {
        if (this.props.icon) {
            return (
                <i className="material-icons right">{this.props.icon}</i>
            )
        }
    },

    render () {
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
                    { this.renderIcon() }
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
                    { this.renderIcon() }
                    {this.props.children}
                </button>
            );
        }
    }
});

module.exports = Button;
