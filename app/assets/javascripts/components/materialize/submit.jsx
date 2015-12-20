'use strict';

var Submit = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },

    getInitialState () {
        return {
            disabled: false
        };
    },

    enabledSubmit () {
        this.setState({disabled: false});
    },

    disabledSubmit () {
        this.setState({disabled: true});
    },

    render () {
        return (
            <input ref={this.props.id}
                   id={this.props.id}
                   disabled={this.state.disabled}
                   className="btn"
                   type="submit"
                   value={this.props.children}
                   onClick={this.props.onClick}
                   name="commit">
            </input>
        );
    }
});

module.exports = Submit;
