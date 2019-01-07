'use strict';

import {
    hot
} from 'react-hot-loader';

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

import FormTopic from './form';

import styles from '../../../jss/topic/form';

export default @hot(module)

@connect((state, props) => ({
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    editingTopic: getEditingTopic(state, props.initialData)
}), {
    addTopic,
    updateTopic,
    deleteTopic,
    showTopicPopup
})
@withStyles(styles)
class TopicModal extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        initialData: PropTypes.object,
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
        initialData: {}
    };

    constructor(props) {
        super(props);
    }

    state = {
        open: true
    };

    // _handleOpen = () => {
    //     this.setState({open: true});
    // };

    _handleClose = () => {
        this.setState({open: false});

        this.props.history.push({
            hash: undefined
        });
    };

    _handleTopicSubmit = (topicName, topicVisibility) => {
        if (this.props.editingTopic) {
            this.props.updateTopic(this.props.userId, {
                id: this.props.editingTopic.id,
                name: topicName,
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
            .then(() => this.setState({open: false}));
    };

    render() {
        return (
            <Modal open={this.state.open}
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

                    <FormTopic classes={this.props.classes}
                               topic={this.props.editingTopic}
                               isEditing={!!this.props.editingTopic}
                               defaultVisibility={this.props.initialData.visibility}
                               onCancel={this._handleClose}
                               onSubmit={this._handleTopicSubmit}
                               onDelete={this._handleTopicDelete}/>
                </div>
            </Modal>
        );
    }
}
