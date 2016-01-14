'use strict';

var classname = require('classnames');

var SingleTimelineItem = React.createClass({
    propTypes: {
        date: React.PropTypes.string.isRequired,
        content: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired,
        children: React.PropTypes.array.isRequired
    },

    render () {
        return (
            <div className="timeline-item">
                <div className="timeline-icon">
                    <i className="material-icons">{this.props.icon}</i>
                </div>
                <div className="timeline-date">
                    {this.props.date}
                </div>
                <div className="timeline-content">
                    {this.props.children}
                    <div className="card-panel"
                         dangerouslySetInnerHTML={{__html: this.props.content}}/>
                </div>
            </div>
        );
    }
});

module.exports = SingleTimelineItem;
