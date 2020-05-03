'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchMetaTags,
    switchTagSidebar
} from '../../actions';

import {
    getCurrentUserTopicVisibility
} from '../../selectors';

import Loader from '../theme/loader';

import articleMutationManager from './managers/mutation';
import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

import styles from '../../../jss/article/form';

export default @articleMutationManager('new')
@connect((state) => ({
    userSlug: state.userState.currentSlug,
    inheritVisibility: getCurrentUserTopicVisibility(state)
}), {
    fetchMetaTags,
    switchTagSidebar
})
@hot
@withStyles(styles)
class ArticleNew extends React.Component {
    static propTypes = {
        // from articleMutationManager
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        article: PropTypes.object,
        currentMode: PropTypes.string,
        pasteContent: PropTypes.string,
        articleErrors: PropTypes.array,
        isTagError: PropTypes.bool,
        onCancel: PropTypes.func,
        onFormChange: PropTypes.func,
        onSubmit: PropTypes.func,
        // from connect
        userSlug: PropTypes.string,
        inheritVisibility: PropTypes.string,
        fetchMetaTags: PropTypes.func,
        switchTagSidebar: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._metaTagsFetched = false;
    }

    componentDidMount() {
        this.props.switchTagSidebar(false);

        this._fetchMetaTags();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.articleErrors !== nextProps.articleErrors || this.props.inheritVisibility !== nextProps.inheritVisibility || this.props.currentMode !== nextProps.currentMode;
    }

    componentDidUpdate() {
        this._fetchMetaTags();
    }

    _fetchMetaTags = () => {
        if (!this._metaTagsFetched && this.props.currentUser && this.props.currentTopic) {
            this._metaTagsFetched = true;

            this.props.fetchMetaTags('new_article', {
                user_slug: this.props.currentUser.slug,
                topic_slug: this.props.currentTopic.slug
            });
        }
    };

    render() {
        if (!this.props.currentUser || !this.props.currentTopic) {
            return (
                <div className={this.props.classes.root}>
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        const article = {
            topicId: this.props.currentTopic.id,
            picture_ids: '',
            visibility: this.props.inheritVisibility,
            allowComment: this.props.inheritVisibility !== 'only_me'
        };

        if (this.props.article?.temporary) {
            article.visibility = this.props.article.visibility;
            article.allowComment = this.props.article.allowComment;
            article.picture_ids = this.props.article.picture_ids;

            if (this.props.currentTopic.languages?.length > 1) {
                article.title_translations = this.props.article.title_translations;
                article.content_translations = this.props.article.content_translations;
            } else {
                article.title = this.props.article.title;
                article.content = this.props.article.content;
            }
        }

        let isPaste = false;

        if (this.props.pasteContent) {
            isPaste = true;

            article.draft = true;

            const isURL = Utils.isURL(this.props.pasteContent.trim());

            if (isURL) {
                article.mode = 'link';
                article.reference = this.props.pasteContent.trim();
            } else {
                article.mode = 'story';
                article.content = this.props.pasteContent;
            }
        }

        let errorStep = null;
        if (this.props.articleErrors?.length > 0) {
            if (this.props.isTagError) {
                errorStep = 'tag';
            } else {
                errorStep = 'article';
            }
        }

        return (
            <div className={this.props.classes.root}>
                <div className={this.props.classes.breadcrumb}>
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay isForm={true}
                                                  user={this.props.currentUser}
                                                  topic={this.props.currentTopic}/>
                    }
                </div>

                <ArticleFormDisplay article={article}
                                    isPaste={isPaste}
                                    inheritVisibility={this.props.inheritVisibility}
                                    userSlug={this.props.userSlug}
                                    currentUser={this.props.currentUser}
                                    currentTopic={this.props.currentTopic}
                                    currentMode={this.props.currentMode}
                                    errorStep={errorStep}
                                    articleErrors={this.props.articleErrors}
                                    onFormChange={this.props.onFormChange}
                                    onCancel={this.props.onCancel}
                                    onSubmit={this.props.onSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
