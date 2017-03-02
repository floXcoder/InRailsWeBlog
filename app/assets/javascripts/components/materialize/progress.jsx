'use strict';

export default class Progress extends React.PureComponent {
    static propTypes = {
        value: React.PropTypes.number,
        totalValues: React.PropTypes.number,
        progressClass: React.PropTypes.string
    };

    static defaultProps = {
        value: 0,
        totalValues: 100,
        progressClass: ''
    };

    constructor(props) {
        super(props);
    }

    render() {
        let completed = this.props.value;
        if (completed < 0) {
            completed = 0;
        }
        if (completed > 100) {
            completed = 100;
        }

        const progressStyle = {
            width: completed + '%'
        };

        const completionStyle = {
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
}


