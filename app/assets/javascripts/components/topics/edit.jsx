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
    getTopicMetaTags,
    getCurrentUser,
    getTopicErrors
} from '../../selectors';

import Loader from '../theme/loader';

import TopicFormDisplay from './display/form';

import HeadLayout from '../layouts/head';
import NotAuthorized from '../layouts/notAuthorized';

import styles from '../../../jss/topic/edit';

export default @withRouter
@connect((state) => ({
    metaTags: getTopicMetaTags(state),
    topic: state.topicState.topic,
    currentUser: getCurrentUser(state),
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
        currentUser: PropTypes.object,
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
        this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {edit: true});
    }

    _handleSubmit = (values) => {
        let formData = values.toJS();

        formData.id = this.props.topic.id;

        this.props.updateTopic(this.props.topic.user.id, formData)
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
        if (!this.props.topic || !this.props.currentUser) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (!this.props.currentUser || this.props.currentUser.id !== this.props.topic.user.id) {
            return (
                <div className="center margin-top-20">
                    <NotAuthorized/>
                </div>
            )
        }

        const {name, description, ...otherProps} = this.props.topic;

        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                <TopicFormDisplay initialValues={{name, description}}
                                  id={`topic-edit-${this.props.topic.id}`}
                                  topicId={this.props.topic.id}
                                  isEditing={true}
                                  topicErrors={this.props.topicErrors}
                                  onSubmit={this._handleSubmit}>
                    {this.props.topic}
                </TopicFormDisplay>
            </div>
        );
    }
}
