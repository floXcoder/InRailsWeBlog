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
    topicArticlesPath
} from '../../constants/routesHelper';

import {
    fetchTopic,
    updateTopicInventories
} from '../../actions';

import {
    getCurrentUser,
    getTopicErrors
} from '../../selectors';

import Loader from '../theme/loader';

import TopicFormInventoriesDisplay from './display/formInventories';

import HeadLayout from '../layouts/head';
import NotAuthorized from '../layouts/notAuthorized';

import styles from '../../../jss/topic/edit';

export default @withRouter
@connect((state) => ({
    metaTags: state.topicState.metaTags,
    topic: state.topicState.topic,
    currentUser: getCurrentUser(state),
    topicErrors: getTopicErrors(state)
}), {
    fetchTopic,
    updateTopicInventories
})
@hot
@withStyles(styles)
class TopicEditInventories extends React.Component {
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
        updateTopicInventories: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {edit: true});
    }

    _handleSubmit = (event) => {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            // form is invalid! so we do nothing
            return;
        }

        const form = event.target;
        const data = new FormData(form);

        this.props.updateTopicInventories(this.props.topic.id, data)
            .then((response) => {
                if (response.topic) {
                    this.props.history.push({
                        pathname: topicArticlesPath(this.props.topic.user.slug, this.props.topic.slug)
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

        const {inventoryFields, ...otherProps} = this.props.topic;

        return (
            <div className={this.props.classes.root}>
                <HeadLayout>
                    {this.props.metaTags}
                </HeadLayout>

                <TopicFormInventoriesDisplay initialValues={{inventoryFields}}
                                             id={`topic-edit-inventories-${this.props.topic.id}`}
                                             topic={this.props.topic}
                                             topicErrors={this.props.topicErrors}
                                             onSubmit={this._handleSubmit}>
                    {this.props.topic.inventoryFields}
                </TopicFormInventoriesDisplay>
            </div>
        );
    }
}
