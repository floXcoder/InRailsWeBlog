'use strict';

import '../../../stylesheets/pages/article/form.scss';

import {
    ArticleShow
} from '../loaders/components';

import {
    setCurrentTags,
    switchTagSidebar
} from '../../actions';

import {
    getArticleChildTags,
    getArticleParentTags,
    getArticleIsOwner,
    getCurrentUserTopicVisibility
} from '../../selectors';

import {
    articleShowPreloadTime
} from '../modules/constants';

import {
    onPageReady
} from '../loaders/lazyLoader';

import Loader from '../theme/loader';

import NotAuthorized from '../layouts/notAuthorized';

import articleMutationManager from './managers/mutation';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';


export default @articleMutationManager('edit')
@connect((state, props) => ({
    userSlug: state.userState.currentSlug,
    isOwner: getArticleIsOwner(state, props.article),
    inheritVisibility: getCurrentUserTopicVisibility(state),
    parentTags: getArticleParentTags(state, props.article),
    childTags: getArticleChildTags(props.article)
}), {
    setCurrentTags,
    switchTagSidebar
})
class ArticleEdit extends React.Component {
    static propTypes = {
        // from articleMutationManager
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        articleErrors: PropTypes.array,
        onFormChange: PropTypes.func,
        onSubmit: PropTypes.func,
        // from connect
        userSlug: PropTypes.string,
        isOwner: PropTypes.bool,
        inheritVisibility: PropTypes.string,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        setCurrentTags: PropTypes.func,
        switchTagSidebar: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._articleShowTimeout = null;
    }

    componentDidMount() {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));
        }

        this.props.switchTagSidebar(false);

        this._articleShowTimeout = onPageReady(() => ArticleShow.preload(), articleShowPreloadTime);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.article !== nextProps.article || this.props.articleErrors !== nextProps.articleErrors || this.props.isFetching !== nextProps.isFetching || this.props.inheritVisibility !== nextProps.inheritVisibility;
    }

    componentDidUpdate() {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));
        }
    }

    componentWillUnmount() {
        if (this._articleShowTimeout) {
            clearTimeout(this._articleShowTimeout);
        }
    }

    render() {
        if (!this.props.article || !this.props.currentUser || !this.props.currentTopic || this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (!this.props.isOwner) {
            return (
                <div className="center margin-top-20">
                    <NotAuthorized/>
                </div>
            );
        }

        const inventoryData = {};
        if (this.props.article.mode === 'inventory') {
            this.props.article.inventories.map((field) => inventoryData[field.fieldName] = field.value);
        }

        const article = {
            mode: this.props.article.mode,
            summary: this.props.article.summary,
            reference: this.props.article.reference,
            inventories: inventoryData,
            picture_ids: '',
            draft: this.props.article.draft,
            visibility: this.props.article.visibility || this.props.inheritVisibility,
            allowComment: typeof this.props.article.allowComment === 'undefined' && this.props.inheritVisibility === 'only_me' ? false : this.props.article.allowComment
        };

        if (this.props.currentTopic.languages?.length > 1 || this.props.article.languages?.length > 1) {
            article.title_translations = this.props.article.titleTranslations;
            article.content_translations = this.props.article.contentTranslations;
        } else {
            article.title = this.props.article.title;
            article.content = this.props.article.content;
        }

        return (
            <div className="article-form">
                <div className="article-form-breadcrumb">
                    {
                        !!(this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay isForm={true}
                                                  user={this.props.currentUser}
                                                  topic={this.props.currentTopic}
                                                  article={this.props.article}/>
                    }
                </div>

                <ArticleFormDisplay article={article}
                                    isEditing={true}
                                    userSlug={this.props.userSlug}
                                    currentUser={this.props.currentUser}
                                    currentTopic={this.props.currentTopic}
                                    currentMode={this.props.article.mode}
                                    parentTags={this.props.parentTags}
                                    childTags={this.props.childTags}
                                    inheritVisibility={this.props.inheritVisibility}
                                    articleErrors={this.props.articleErrors}
                                    onFormChange={this.props.onFormChange}
                                    onSubmit={this.props.onSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
