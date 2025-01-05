import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    userTopicPath
} from '@js/constants/routesHelper';

import {
    fetchTopic,
    updateTopic
} from '@js/actions/topicActions';

import {
    getTopicErrors
} from '@js/selectors/topicSelectors';

import withRouter from '@js/components/modules/router';

import Loader from '@js/components/theme/loader';

import NotAuthorized from '@js/components/layouts/notAuthorized';

import TopicFormDisplay from '@js/components/topics/display/form';
import TopicErrorField from '@js/components/topics/display/fields/error';

import '@css/pages/topic/form.scss';


class TopicEdit extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserId: PropTypes.number,
        articleMultilanguage: PropTypes.bool,
        isFetching: PropTypes.bool,
        topic: PropTypes.object,
        topicErrors: PropTypes.array,
        fetchTopic: PropTypes.func,
        updateTopic: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopic(this.props.currentUserId, this.props.routeParams.topicSlug, {edit: true});
    }

    _handleSubmit = (values) => {
        values.id = this.props.topic.id;

        return this.props.updateTopic(this.props.topic.user.id, values)
            .then((response) => {
                if (response.topic) {
                    this.props.routeNavigate({
                        pathname: userTopicPath(this.props.topic.user.slug, response.topic.slug)
                    });
                }
            });
    };

    render() {
        if (!this.props.topic || this.props.isFetching) {
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
            );
        }

        const topic = {
            name: this.props.topic.name,
            languages: this.props.topic.languages,
            description_translations: this.props.topic.descriptionTranslations,
            descriptionTranslations: this.props.topic.descriptionTranslations,
            description: this.props.topic.description
        };

        return (
            <div className="topic-edit-root">
                {
                    !!this.props.topic.name &&
                    <div>
                        <h1>
                            {I18n.t('js.topic.edit.title')}
                        </h1>
                    </div>
                }

                {
                    !!this.props.topicErrors &&
                    <div>
                        <TopicErrorField errors={this.props.topicErrors}/>
                    </div>
                }

                <TopicFormDisplay topic={topic}
                                  isEditing={true}
                                  articleMultilanguage={this.props.articleMultilanguage}
                                  onSubmit={this._handleSubmit}>
                    {this.props.topic}
                </TopicFormDisplay>
            </div>
        );
    }
}

export default connect((state) => ({
    currentUserId: state.userState.currentId,
    articleMultilanguage: state.uiState.articleMultilanguage,
    isFetching: state.topicState.isFetching,
    topic: state.topicState.topic,
    topicErrors: getTopicErrors(state)
}), {
    fetchTopic,
    updateTopic
})(withRouter({
    params: true,
    navigate: true
})(TopicEdit));