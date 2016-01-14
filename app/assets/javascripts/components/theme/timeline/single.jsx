'use strict';

var classname = require('classnames');

var SingleTimeline = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired
    },

    render () {
        return (
            <div className="single-timeline">
                {this.props.children}
            </div>
        );
    }
});

module.exports = SingleTimeline;
