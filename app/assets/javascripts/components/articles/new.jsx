'use strict';

import {
    addArticle
} from '../../actions';

import {
    getTags,
    getCurrentUser,
    getCurrentTopic,
    getArticleErrors
} from '../../selectors';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

@connect((state) => ({
    tags: getTags(state),
    currentUser: getCurrentUser(state),
    currentTopic: getCurrentTopic(state),
    articleErrors: getArticleErrors(state)
}), {
    addArticle
})
export default class ArticleNew extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        initialData: PropTypes.object,
        multipleId: PropTypes.number,
        // from connect
        tags: PropTypes.array,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        articleErrors: PropTypes.array,
        addArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        if (props.initialData) {
            this.state.isInline = props.initialData.mode === 'note';
            this.state.currentMode = props.initialData.mode;

            if (this.state.article) {
                this.state.article = props.initialData.article;
                this.state.isDraft = props.initialData.isDraft;

                Notification.success(I18n.t('js.article.clipboard.toast.done'));
            }

            if (props.initialData.parentTagSlug) {
                this.state.article = this.state.article || {};

                this.state.article.tags = props.tags.filter((tag) => tag.slug === props.initialData.parentTagSlug || tag.slug === props.initialData.childTagSlug);
                this.state.article.parentTagSlugs = [props.initialData.parentTagSlug];
                if (props.initialData.childTagSlug) {
                    this.state.article.childTagSlugs = [props.initialData.childTagSlug];
                }
            }
        }
    }

    state = {
        isInline: false,
        article: undefined,
        currentMode: undefined,
        isDraft: undefined
    };

    // componentDidMount() {
    //     Mousetrap.bind('alt+s', () => {
    //         this._toggleNewForm();
    //         return false;
    //     }, 'keydown');
    // }

    _handleSubmit = (values) => {
        let formData = values.toJS();

        if (formData.parent_tags) {
            formData.parent_tags = formData.parent_tags.map((parentTag) => ({
                name: parentTag.value,
                visibility: parentTag.category,
                new: parentTag.isNew
            }));
        }

        if (formData.child_tags) {
            formData.child_tags = formData.child_tags.map((childTag) => ({
                name: childTag.value,
                visibility: childTag.category,
                new: childTag.isNew
            }));
        }

        this.props.addArticle(formData)
            .then((response) => {
                if (response.article) {
                    this.props.history.push({
                        pathname: `/article/${response.article.slug}`,
                        state: {reloadTags: true}
                    });
                }
            });

        return true;
    };

    render() {
        return (
            <div className="blog-form">
                <div className="blog-breadcrumb">
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}/>
                    }
                </div>

                <ArticleFormDisplay id={'article-new' + (this.props.multipleId ? '-' + this.props.multipleId : '')}
                                    isInline={this.state.isInline}
                                    currentMode={this.state.currentMode}
                                    isDraft={this.state.isDraft}
                                    articleErrors={this.props.articleErrors}
                                    onSubmit={this._handleSubmit}>
                    {this.state.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
