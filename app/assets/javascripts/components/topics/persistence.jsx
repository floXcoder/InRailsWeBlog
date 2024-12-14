import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import I18n from '@js/modules/translations';
import Notification from '@js/modules/notification';

import {
    topicArticlesPath,
    editInventoriesTopicPath
} from '@js/constants/routesHelper';

import {
    addTopic,
    updateTopic,
    deleteTopic
} from '@js/actions/topicActions';

import {
    showTopicPopup
} from '@js/actions/uiActions';

import {
    fetchTags
} from '@js/actions/tagActions';

import {
    getEditingTopic
} from '@js/selectors/topicSelectors';

import AnalyticsService from '@js/modules/analyticsService';

import PersistenceFormTopic from '@js/components/topics/persistence/form';

import withRouter from '@js/components/modules/router';


class TopicPersistence extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        routeLocation: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        currentUserLocale: PropTypes.string,
        articleMultilanguage: PropTypes.bool,
        userSlug: PropTypes.string,
        editingTopic: PropTypes.object,
        addTopic: PropTypes.func,
        updateTopic: PropTypes.func,
        deleteTopic: PropTypes.func,
        showTopicPopup: PropTypes.func,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true
    };

    componentDidMount() {
        if (this.state.isOpen) {
            AnalyticsService.trackTopicPersistencePage(this.props.userSlug);
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

    _handleTopicSubmit = (name, mode, description, visibility, languages) => {
        if (this.props.editingTopic) {
            this.props.updateTopic(this.props.currentUserId, {
                id: this.props.editingTopic.id,
                name,
                mode,
                description,
                visibility,
                languages
            })
                .then((response) => {
                    this._handleClose();
                    this.props.showTopicPopup();

                    return response;
                })
                .then((response) => {
                    if (response.topic) {
                        return this.props.routeNavigate(topicArticlesPath(this.props.userSlug, response.topic.slug));
                    }
                });
        } else {
            this.props.addTopic(this.props.currentUserId, {
                name,
                mode,
                description: description || undefined,
                visibility,
                languages
            })
                .then((response) => {
                    this._handleClose();
                    this.props.showTopicPopup();

                    return response;
                })
                .then((response) => {
                    if (response.topic) {
                        this.props.fetchTags(
                            {
                                topicSlug: response.topic.slug
                            },
                            {},
                            {
                                topicTags: true
                            }
                        );

                        if (response.topic.mode === 'inventories') {
                            Notification.success('Vous pouvez maintenant ajouter les champs personnalisés pour les articles');

                            this.props.routeNavigate(editInventoriesTopicPath(this.props.userSlug, response.topic.slug));
                        } else {
                            this.props.routeNavigate(topicArticlesPath(this.props.userSlug, response.topic.slug));
                        }
                    }

                    return response;
                });
        }
    };

    _handleTopicDelete = (topicId) => {
        this.props.deleteTopic(this.props.currentUserId, topicId)
            .then(() => this.props.showTopicPopup())
            .then(() => this.setState({
                isOpen: false
            }))
            .then(() => window.location = '/');
    };

    _renderTitle = () => {
        if (this.props.routeLocation?.state?.signup) {
            return I18n.t('js.topic.edit.title_signup');
        } else if (this.props.editingTopic) {
            return I18n.t('js.topic.edit.title');
        } else {
            return I18n.t('js.topic.new.title');
        }
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="topic-persistence-modal">
                    <Typography variant="h6"
                                gutterBottom={true}>
                        {this._renderTitle()}
                    </Typography>

                    <PersistenceFormTopic topic={this.props.editingTopic}
                                          isEditing={!!this.props.editingTopic}
                                          articleMultilanguage={this.props.articleMultilanguage}
                                          defaultMode={this.props.routeLocation?.state?.mode}
                                          defaultVisibility={this.props.routeLocation?.state?.visibility}
                                          defaultLocale={this.props.currentUserLocale}
                                          onCancel={this._handleClose}
                                          onSubmit={this._handleTopicSubmit}
                                          onDelete={this._handleTopicDelete}/>
                </div>
            </Modal>
        );
    }
}

export default withRouter({
    location: true,
    navigate: true
})(connect((state, props) => ({
    currentUserId: state.userState.currentId,
    currentUserLocale: state.userState.user?.locale,
    articleMultilanguage: state.uiState.articleMultilanguage,
    userSlug: state.userState.currentSlug,
    editingTopic: getEditingTopic(state, props.routeLocation.state)
}), {
    addTopic,
    updateTopic,
    deleteTopic,
    showTopicPopup,
    fetchTags,
})(TopicPersistence));