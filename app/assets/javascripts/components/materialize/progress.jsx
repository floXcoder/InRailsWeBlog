'use strict';

var Progress = React.createClass({
    propTypes: {
        value: React.PropTypes.number,
        totalValues: React.PropTypes.number,
        progressClass: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            value: 0,
            totalValues: 100,
            progressClass: ''
        };
    },

    render () {
        var completed = this.props.value;
        if (completed < 0) {
            completed = 0;
        }
        if (completed > 100) {
            completed = 100;
        }

        var progressStyle = {
            width: completed + '%'
        };

        var completionStyle = {
            width: this.props.totalValues + '%'
        };

        return (
            <div className="progress"
                 style={completionStyle}>
                <div className="determinate"
                     style={progressStyle}></div>
            </div>
        );
    }
});

module.exports = Progress;

