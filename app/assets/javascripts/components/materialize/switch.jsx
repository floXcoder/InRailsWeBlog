'use strict';

var Switch = React.createClass({
    propTypes: {
        values: React.PropTypes.object.isRequired,
        checked: React.PropTypes.bool,
        onCheckboxChanged: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            checked: false,
            onCheckboxChanged: null
        };
    },

    render () {
        return (
            <div className="switch">
                <label>
                    {this.props.values.false}
                    <input type="checkbox"
                           ref="checkbox"
                           checked={this.props.checked}
                           onChange={this.props.onCheckboxChanged} />
                    <span className="lever" />
                    {this.props.values.true}
                </label>
            </div>
        );
    }
});

module.exports = Switch;

