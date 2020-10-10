'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
    topicArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import styles from '../../../../jss/topic/stories/summary';

export default @withStyles(styles)
class SummaryStoriesTopic extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        topic: PropTypes.object.isRequired,
        hasLink: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        hasLink: false
    }

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
                    <Link to={topicArticlesPath(this.props.userSlug, this.props.topic.slug)}
                          onClick={this._handleTopicClick.bind(this, this.props.topic.id, this.props.topic.slug, this.props.topic.name)}>
                        <Typography className={this.props.classes.topicTitle}
                                    variant="h4"
                                    component="h2">
                            {this.props.topic.name}
                        </Typography>
                    </Link>

                    <Typography className={this.props.classes.topicDesc}
                                component="p">
                        {this.props.topic.description}
                    </Typography>

                    {
                        this.props.hasLink &&
                        <div className="center margin-top-15">
                            <Button className={this.props.classes.topicLink}
                                    color="primary"
                                    variant="outlined"
                                    component={Link}
                                    to={topicArticlesPath(this.props.userSlug, this.props.topic.slug)}
                                    onClick={this._handleTopicClick.bind(this, this.props.topic.id, this.props.topic.slug, this.props.topic.name)}>
                                {I18n.t('js.article.common.all_stories')}
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
