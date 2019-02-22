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
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import {
    addTopic,
    updateTopic,
    deleteTopic,
    showTopicPopup
} from '../../actions';

import {
    getEditingTopic
} from '../../selectors';

import PersistenceFormTopic from './persistence/form';

import styles from '../../../jss/topic/persistence';

export default @withRouter
@connect((state, props) => ({
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    editingTopic: getEditingTopic(state, props.routeState)
}), {
    addTopic,
    updateTopic,
    deleteTopic,
    showTopicPopup
})
@hot
@withStyles(styles)
class TopicPersistence extends React.Component {
    static propTypes = {
        routeState: PropTypes.object,
        // from router
        history: PropTypes.object,
        // from connect
        userId: PropTypes.number,
        userSlug: PropTypes.string,
        editingTopic: PropTypes.object,
        addTopic: PropTypes.func,
        updateTopic: PropTypes.func,
        deleteTopic: PropTypes.func,
        showTopicPopup: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        routeState: {}
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true
    };

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history.push({
            hash: undefined
        });
    };

    _handleTopicSubmit = (topicName, topicMode, topicDescription, topicVisibility) => {
        if (this.props.editingTopic) {
            this.props.updateTopic(this.props.userId, {
                id: this.props.editingTopic.id,
                name: topicName,
                mode: topicMode,
                description: topicDescription,
                visibility: topicVisibility
            })
                .then((response) => {
                    if (response.topic) {
                        return this.props.history.push(`/users/${this.props.userSlug}/topics/${response.topic.slug}`);
                    }
                })
                .then(() => this.props.showTopicPopup());
        } else {
            this.props.addTopic(this.props.userId, {
                name: topicName,
                mode: topicMode,
                description: topicDescription,
                visibility: topicVisibility
            })
                .then((response) => {
                    if (response.topic) {
                        return this.props.history.push(`/users/${this.props.userSlug}/topics/${response.topic.slug}`);
                    }
                })
                .then(() => this.props.showTopicPopup());
        }
    };

    _handleTopicDelete = (topicId) => {
        this.props.deleteTopic(this.props.userId, topicId)
            .then(() => this.props.showTopicPopup())
            .then(() => this.setState({
                isOpen: false
            }));
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className={this.props.classes.modal}>
                    <Typography variant="h6">
                        {
                            this.props.editingTopic
                                ?
                                I18n.t('js.topic.edit.title')
                                :
                                I18n.t('js.topic.new.title')
                        }
                    </Typography>

                    <PersistenceFormTopic classes={this.props.classes}
                                          topic={this.props.editingTopic}
                                          isEditing={!!this.props.editingTopic}
                                          defaultMode={this.props.routeState.mode}
                                          defaultVisibility={this.props.routeState.visibility}
                                          onCancel={this._handleClose}
                                          onSubmit={this._handleTopicSubmit}
                                          onDelete={this._handleTopicDelete}/>
                </div>
            </Modal>
        );
    }
}
