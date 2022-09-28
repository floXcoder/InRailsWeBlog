'use strict';

import {
    Link
} from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {
    topicArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';


export default class SummaryStoriesTopic extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        topic: PropTypes.object.isRequired,
        hasLink: PropTypes.bool
    };

    static defaultProps = {
        hasLink: false
    };

    constructor(props) {
        super(props);
    }

    _handleTopicClick = (topicId, topicSlug, topicUserId, topicName) => {
        spyTrackClick('topic', topicId, topicSlug, topicUserId, topicName, null);
    };

    render() {
        return (
            <div className="topic-summary-container">
                <div className="topic-summary-root">
                    <Link to={topicArticlesPath(this.props.userSlug, this.props.topic.slug)}
                          onClick={this._handleTopicClick.bind(this, this.props.topic.id, this.props.topic.slug, this.props.topic.userId, this.props.topic.name)}>
                        <Typography className="topic-summary-topic-title"
                                    variant="h4"
                                    component="h2">
                            {this.props.topic.name}
                        </Typography>
                    </Link>

                    <Typography component="div"
                                className="topic-summary-topic-desc">
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.topic.description}}/>
                    </Typography>

                    {
                        !!this.props.hasLink &&
                        <div className="center margin-top-15">
                            <Button className="topic-summary-topic-link"
                                    color="primary"
                                    variant="outlined"
                                    component={Link}
                                    to={topicArticlesPath(this.props.userSlug, this.props.topic.slug)}
                                    onClick={this._handleTopicClick.bind(this, this.props.topic.id, this.props.topic.slug, this.props.topic.userId, this.props.topic.name)}>
                                {I18n.t('js.article.common.all_stories')}
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
