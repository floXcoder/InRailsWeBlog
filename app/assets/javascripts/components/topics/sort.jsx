'use strict';

import '../../../stylesheets/pages/topic/sort.scss';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {
    fetchTopics,
    updateTopicPriority
} from '../../actions';

import AnalyticsService from '../../modules/analyticsService';

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import TopicSorter from './sort/sorter';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    isFetching: state.topicState.isFetching,
    topics: state.topicState.topics
}), {
    fetchTopics,
    updateTopicPriority
})
@withRouter({location: true, navigate: true})
class SortTopicModal extends React.Component {
    static propTypes = {
        // from router
        routeLocation: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        topics: PropTypes.array,
        fetchTopics: PropTypes.func,
        updateTopicPriority: PropTypes.func
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
            visibility: this.props.routeLocation?.state?.visibility
        });

        if (this.state.isOpen) {
            AnalyticsService.trackTopicSortPage(this.props.currentUserSlug);
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

    _handleUpdatePriority = (topicIds) => {
        this.props.updateTopicPriority(this.props.currentUserId, topicIds)
            .then(() => {
                this.props.routeNavigate({
                    hash: undefined
                });
            });
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="topic-sort-modal">
                    <Typography className="topic-sort-title"
                                variant="h6">
                        {I18n.t('js.topic.sort.title')}
                    </Typography>

                    {
                        !!(this.props.isFetching && this.props.topics.length === 0) &&
                        <div className="center margin-top-20">
                            <Loader size="big"/>
                        </div>
                    }

                    {
                        this.props.topics.length > 0 &&
                        <TopicSorter key={Utils.uuid()}
                                     topics={this.props.topics}
                                     updateTopicPriority={this._handleUpdatePriority}/>
                    }
                </div>
            </Modal>
        );
    }
}
