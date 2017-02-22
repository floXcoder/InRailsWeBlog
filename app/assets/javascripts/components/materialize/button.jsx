'use strict';

const classNames = require('classnames');

var Button = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        icon: React.PropTypes.string,
        iconPosition: React.PropTypes.string,
        tooltip: React.PropTypes.string,
        onButtonClick: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            id: null,
            type: 'submit',
            className: null,
            icon: null,
            iconPosition: 'right',
            tooltip: null,
            onButtonClick: null
        };
    },

    getInitialState() {
        return {
            isDisabled: false
        };
    },

    componentDidMount () {
        if (this.props.tooltip) {
            let selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        return !_.isEqual(this.state.isDisabled, nextState.isDisabled) || this.props.children !== nextProps.children;
    },

    componentDidUpdate () {
        if (this.props.tooltip) {
            const selector = '.tooltipped' + (this.props.id ? '#' + this.props.id : '');
            $(selector).tooltip();
        }
    },

    toggleButton() {
        this.setState({isDisabled: !this.state.disabled});
    },

    render () {
        let tooltipData = {};
        if (this.props.tooltip) {
            tooltipData = {
                'data-position': 'bottom',
                'data-delay': '50',
                'data-tooltip': this.props.tooltip
            };
        }

        const buttonClass = classNames(
            'btn waves-effect waves-light',
            this.props.className,
            {'tooltipped': !$.isEmpty(this.props.tooltip)}
        );

        return (
            <button className={buttonClass}
                    id={this.props.id}
                    type={this.props.type}
                    method="post"
                    onClick={this.props.onButtonClick}
                    disabled={this.state.disabled}
                    {...tooltipData}>
                {
                    this.props.icon &&
                    <i className={`material-icons ${this.props.iconPosition}`}>{this.props.icon}</i>
                }
                {this.props.children}
            </button>
        );
    }
});

module.exports = Button;
