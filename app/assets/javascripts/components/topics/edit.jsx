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
    fetchTopic,
    updateTopic
} from '../../actions';

import {
    getTopicErrors
} from '../../selectors';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotAuthorized from '../layouts/notAuthorized';

import TopicFormDisplay from './display/form';
import TopicErrorField from './display/fields/error';

import styles from '../../../jss/topic/edit';

export default @withRouter
@connect((state) => ({
    currentUserId: state.userState.currentId,
    metaTags: state.topicState.metaTags,
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
        metaTags: PropTypes.object,
        topic: PropTypes.object,
        currentUserId: PropTypes.number,
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
                        pathname: `/users/${this.props.topic.user.slug}/topics/${this.props.topic.slug}/show`
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
                <HeadLayout metaTags={this.props.metaTags}/>

                <TopicFormDisplay id={`topic-edit-${this.props.topic.id}`}
                                  topic={this.props.topic}
                                  isEditing={true}
                                  onSubmit={this._handleSubmit}>
                    {this.props.topic}
                </TopicFormDisplay>
            </div>
        );
    }
}
