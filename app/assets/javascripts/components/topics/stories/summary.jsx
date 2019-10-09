'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import {
    spyTrackClick
} from '../../../actions';

import styles from '../../../../jss/topic/stories/summary';

export default @withStyles(styles)
class SummaryStoriesTopic extends React.Component {
    static propTypes = {
        topic: PropTypes.object.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleTopicClick = (elementId, elementSlug, elementTitle) => {
        spyTrackClick('topic', elementId, elementSlug, elementTitle);
    };

    render() {
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.root}>
                    {
                        this.props.topic.user.slug
                            ?
                            <Link to={`/users/${this.props.topic.user.slug}/topics/${this.props.topic.slug}`}
                                  onClick={this._handleTopicClick.bind(this, this.props.topic.id, this.props.topic.slug, this.props.topic.name)}>
                                <Typography className={this.props.classes.topicTitle}
                                            variant="h4"
                                            component="h2">
                                    {this.props.topic.name}
                                </Typography>
                            </Link>
                            :
                            <Typography className={this.props.classes.topicTitle}
                                        variant="h4"
                                        component="h2">
                                {this.props.topic.name}
                            </Typography>
                    }

                    <Typography component="p">
                        {this.props.topic.description}
                    </Typography>
                </div>
            </div>
        );
    }
}
