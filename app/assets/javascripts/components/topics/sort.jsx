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
    fetchTopics,
    updateTopicPriority
} from '../../actions';

import {
    getTopics
} from '../../selectors';

import Loader from '../theme/loader';

import TopicSorter from './sort/sorter';

import styles from '../../../jss/topic/sort';

export default @withRouter
@connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    isFetching: state.topicState.isFetching,
    topics: getTopics(state)
}), {
    fetchTopics,
    updateTopicPriority
})
@hot
@withStyles(styles)
class SortTopicModal extends React.Component {
    static propTypes = {
        routeState: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        isFetching: PropTypes.bool,
        topics: PropTypes.array,
        fetchTopics: PropTypes.func,
        updateTopicPriority: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true
    };

    componentDidMount() {
        this.props.fetchTopics(this.props.currentUserId, {
            order: 'priority_desc',
            visibility: this.props.routeState.visibility
        });
    }

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history.push({
            hash: undefined
        });
    };

    _handleUpdatePriority = (topicIds) => {
        this.props.updateTopicPriority(this.props.currentUserId, topicIds)
            .then(() => {
                this.props.history.push({
                    hash: undefined
                });
            });
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className={this.props.classes.modal}>
                    <Typography className={this.props.classes.title}
                                variant="h6">
                        {I18n.t('js.topic.sort.title')}
                    </Typography>

                    {
                        (this.props.isFetching && this.props.topics.length === 0) &&
                        <div className="center margin-top-20">
                            <Loader size="big"/>
                        </div>
                    }

                    {
                        this.props.topics.length > 0 &&
                        <TopicSorter key={Utils.uuid()}
                                     classes={this.props.classes}
                                     topics={this.props.topics}
                                     updateTopicPriority={this._handleUpdatePriority}/>
                    }
                </div>
            </Modal>
        );
    }
}
