'use strict';

var classname = require('classnames');

var DoubleTimeline = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired
    },

    render () {
        return (
            <div className="double-timeline">
                {this.props.children}
            </div>
        );
    }
});

module.exports = DoubleTimeline;
