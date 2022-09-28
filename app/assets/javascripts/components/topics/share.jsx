'use strict';

import '../../../stylesheets/pages/topic/share.scss';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import {
    validateUser,
    shareTopic
} from '../../actions';

import AnalyticsService from '../../modules/analyticsService';

import withRouter from '../modules/router';

import ShareFormTopic from './share/form';


export default @withRouter({location: true, navigate: true})
@connect((state) => ({
    topic: state.topicState.topic
}), {
    shareTopic
})
class ShareTopicModal extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        // from connect
        topic: PropTypes.object,
        shareTopic: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true,
        errorText: undefined
    };

    componentDidMount() {
        if (this.state.isOpen && this.props.topic) {
            AnalyticsService.trackTopicSharePage(this.props.topic.user.slug, this.props.topic.slug);
        }
    }

    componentDidUpdate() {
        if (this.state.isOpen) {
            AnalyticsService.trackTopicSharePage(this.props.topic.user.slug, this.props.topic.slug);
        }
    }

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.routeNavigate({
            hash: undefined
        });
    };

    _handleUserChange = (userLogin) => {
        validateUser(userLogin).then((response) => {
            if (!response.success) {
                this.setState({
                    errorText: I18n.t('js.topic.share.errors.unknown')
                });
            } else {
                this.setState({
                    errorText: null
                });
            }
        });
    };

    _handleShareSubmit = (userLogin) => {
        if (Utils.isEmpty(userLogin)) {
            this.setState({
                errorText: I18n.t('js.topic.share.errors.user_empty')
            });
        } else {
            this.props.shareTopic(this.props.topic.id, userLogin)
                .then((response) => {
                    if (!response.errors) {
                        this._handleClose();
                    }
                });
        }
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="topic-share-modal">
                    <Typography className="topic-share-title"
                                variant="h6">
                        {I18n.t('js.topic.share.title')}
                    </Typography>

                    <ShareFormTopic errorText={this.state.errorText}
                                    onUserChange={this._handleUserChange}
                                    onCancel={this._handleClose}
                                    onShare={this._handleShareSubmit}/>
                </div>
            </Modal>
        );
    }
}
