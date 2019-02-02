'use strict';

import {
    withStyles
} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import styles from '../../../../jss/topic/stories/summary';

export default @withStyles(styles)

class SummaryStoriesTopic extends React.Component {
    static propTypes = {
        topic: PropTypes.object.isRequired,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.root}>
                    <Typography className={this.props.classes.topicTitle}
                                variant="h4"
                                component="h2">
                        {this.props.topic.name}
                    </Typography>

                    <Typography component="p">
                        {this.props.topic.description}
                    </Typography>
                </div>
            </div>
        );
    }
}
