'use strict';

import '../../../stylesheets/pages/topic/form.scss';

import {
    hot
} from 'react-hot-loader/root';

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

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import TopicFormInventoriesDisplay from './display/formInventories';

import NotAuthorized from '../layouts/notAuthorized';


export default @connect((state) => ({
    topic: state.topicState.topic,
    currentUser: getCurrentUser(state),
    topicErrors: getTopicErrors(state)
}), {
    fetchTopic,
    updateTopicInventories
})
@withRouter({params: true, navigate: true})
@hot
class TopicEditInventories extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.object,
        // from connect
        topic: PropTypes.object,
        currentUser: PropTypes.object,
        topicErrors: PropTypes.array,
        fetchTopic: PropTypes.func,
        updateTopicInventories: PropTypes.func
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
                    this.props.routeNavigate({
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
            );
        }

        const {inventoryFields} = this.props.topic;

        return (
            <div className="topic-edit-root">
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
