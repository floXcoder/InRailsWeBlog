'use strict';

import '../../../stylesheets/pages/topic/form.scss';

import {
    userTopicPath
} from '../../constants/routesHelper';

import {
    fetchTopic,
    updateTopic
} from '../../actions';

import {
    getTopicErrors
} from '../../selectors';

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import NotAuthorized from '../layouts/notAuthorized';

import TopicFormDisplay from './display/form';
import TopicErrorField from './display/fields/error';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    articleMultilanguage: state.uiState.articleMultilanguage,
    isFetching: state.topicState.isFetching,
    topic: state.topicState.topic,
    topicErrors: getTopicErrors(state)
}), {
    fetchTopic,
    updateTopic
})
@withRouter({params: true, navigate: true})
class TopicEdit extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.object,
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
                    this.props.topic.name &&
                    <div>
                        <h1>
                            {I18n.t('js.topic.edit.title')}
                        </h1>
                    </div>
                }

                {
                    this.props.topicErrors &&
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
