'use strict';

var Textarea = React.createClass({
    propTypes: {
        children: React.PropTypes.element.isRequired,
        id: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            onChange: null
        };
    },

    render () {
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

