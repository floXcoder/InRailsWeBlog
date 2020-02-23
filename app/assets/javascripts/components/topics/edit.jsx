'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    userTopicPath
} from '../../constants/routesHelper';

import {
    fetchTopic,
    updateTopic
} from '../../actions';

import {
    getTopicErrors
} from '../../selectors';

import Loader from '../theme/loader';

import NotAuthorized from '../layouts/notAuthorized';

import TopicFormDisplay from './display/form';
import TopicErrorField from './display/fields/error';

import styles from '../../../jss/topic/edit';

export default @withRouter
@connect((state) => ({
    currentUserId: state.userState.currentId,
    articleMultilanguage: state.uiState.articleMultilanguage,
    topic: state.topicState.topic,
    topicErrors: getTopicErrors(state)
}), {
    fetchTopic,
    updateTopic
})
@hot
@withStyles(styles)
class TopicEdit extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        articleMultilanguage: PropTypes.bool,
        topic: PropTypes.object,
        topicErrors: PropTypes.array,
        fetchTopic: PropTypes.func,
        updateTopic: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopic(this.props.currentUserId, this.props.routeParams.topicSlug, {edit: true});
    }

    _handleSubmit = (values) => {
        values.id = this.props.topic.id;

        this.props.updateTopic(this.props.topic.user.id, values)
            .then((response) => {
                if (response.topic) {
                    this.props.history.push({
                        pathname: userTopicPath(this.props.topic.user.slug, this.props.topic.slug)
                    });
                }
            });

        return true;
    };

    render() {
        if (this.props.topicErrors) {
            return (
                <div>
                    <TopicErrorField errors={this.props.topicErrors}/>
                </div>
            );
        }

        if (!this.props.topic) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (this.props.currentUserId !== this.props.topic.user.id) {
            return (
                <div className="center margin-top-20">
                    <NotAuthorized/>
                </div>
            )
        }

        return (
            <div className={this.props.classes.root}>
                <TopicFormDisplay id={`topic-edit-${this.props.topic.id}`}
                                  topic={this.props.topic}
                                  isEditing={true}
                                  articleMultilanguage={this.props.articleMultilanguage}
                                  onSubmit={this._handleSubmit}>
                    {this.props.topic}
                </TopicFormDisplay>
            </div>
        );
    }
}
