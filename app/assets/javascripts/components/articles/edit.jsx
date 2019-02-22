'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    ArticleShow
} from '../loaders/components';

import {
    setCurrentTags,
    switchTagSidebar
} from '../../actions';

import {
    getArticleMetaTags,
    getArticleIsOwner,
    getCurrentUserTopicVisibility,
    getCurrentLocale
} from '../../selectors';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotAuthorized from '../layouts/notAuthorized';

import articleMutationManager from './managers/mutation';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

import styles from '../../../jss/article/form';

export default @articleMutationManager('edit', `article-${Utils.uuid()}`)
@connect((state, props) => ({
    metaTags: getArticleMetaTags(state),
    userSlug: state.userState.currentSlug,
    isOwner: getArticleIsOwner(state, props.article),
    inheritVisibility: getCurrentUserTopicVisibility(state)
}), {
    setCurrentTags,
    switchTagSidebar
})
@hot
@withStyles(styles)
class ArticleEdit extends React.Component {
    static propTypes = {
        // from articleMutationManager
        formId: PropTypes.string,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        onSubmit: PropTypes.func,
        // from connect
        metaTags: PropTypes.object,
        userSlug: PropTypes.string,
        isOwner: PropTypes.bool,
        inheritVisibility: PropTypes.string,
        setCurrentTags: PropTypes.func,
        switchTagSidebar: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));
        }

        this.props.switchTagSidebar(false);

        setTimeout(() => ArticleShow.preload(), 5000);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.article !== nextProps.article || this.props.articleErrors !== nextProps.articleErrors || this.props.isFetching !== nextProps.isFetching || this.props.inheritVisibility !== nextProps.inheritVisibility;
    }

    componentDidUpdate() {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));
        }
    }

    render() {
        if (!this.props.article || !this.props.currentUser || !this.props.currentTopic) {
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
            )
        }

        const initialValues = {
            mode: this.props.article.mode,
            title: this.props.article.title,
            summary: this.props.article.summary,
            reference: this.props.article.reference,
            picture_ids: '',
            draft: this.props.isDraft || this.props.article.draft,
            visibility: this.props.article.visibility || this.props.inheritVisibility,
            language: this.props.article.language || getCurrentLocale(),
            allowComment: typeof this.props.article.allowComment === 'undefined' && this.props.inheritVisibility === 'only_me' ? false : this.props.article.allowComment
        };

        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                <div className={this.props.classes.breadcrumb}>
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}
                                                  article={this.props.article}/>
                    }
                </div>

                <ArticleFormDisplay form={this.props.formId}
                                    inheritVisibility={this.props.inheritVisibility}
                                    userSlug={this.props.userSlug}
                                    initialValues={initialValues}
                                    currentMode={this.props.article.mode}
                                    isEditing={true}
                                    isDraft={this.props.article.isDraft}
                                    articleErrors={this.props.articleErrors}
                                    onSubmit={this.props.onSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
