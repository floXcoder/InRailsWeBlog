'use strict';

var classname = require('classnames');

var DoubleTimelineItem = React.createClass({
    propTypes: {
        date: React.PropTypes.string.isRequired,
        content: React.PropTypes.string.isRequired,
        children: React.PropTypes.array.isRequired,
        icon: React.PropTypes.string.isRequired,
        title: React.PropTypes.string
    },

    render () {
        return (
            <div className="timeline-block">
                <div className="timeline-icon red lighten-2 white-text">
                    <i className="material-icons">{this.props.icon}</i>
                </div>

                <div className="card-panel timeline-content">
                    {
                        this.props.title &&
                        <h4 className="timeline-date">
                            {this.props.title}
                        </h4>
                    }
                    <p dangerouslySetInnerHTML={{__html: this.props.content}}/>
                    <p className="timeline-link">
                        {this.props.children}
                    </p>
                    <span className="timeline-date">
                        {this.props.date}
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = DoubleTimelineItem;
