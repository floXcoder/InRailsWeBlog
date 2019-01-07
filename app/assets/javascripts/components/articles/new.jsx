'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    switchTagSidebar
} from '../../actions';

import {
    getCurrentUserTopicVisibility,
    getCurrentLocale
} from '../../selectors';

import articleMutationManager from './managers/mutation';

import HeadLayout from '../layouts/head';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

import styles from '../../../jss/article/form';

export default @hot(module)

@articleMutationManager('new', `article-${Utils.uuid()}`)
@connect((state) => ({
    userSlug: state.userState.currentSlug,
    inheritVisibility: getCurrentUserTopicVisibility(state)
}), {
    switchTagSidebar
})
@withStyles(styles)
class ArticleNew extends React.Component {
    static propTypes = {
        // from articleMutationManager
        formId: PropTypes.string,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        article: PropTypes.object,
        isInline: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        onCancelClick: PropTypes.func,
        onSubmit: PropTypes.func,
        // from connect
        userSlug: PropTypes.string,
        inheritVisibility: PropTypes.string,
        switchTagSidebar: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.switchTagSidebar(false);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.articleErrors !== nextProps.articleErrors || this.props.inheritVisibility !== nextProps.inheritVisibility;
    }

    render() {
        const initialValues = {
            picture_ids: '',
            draft: this.props.isDraft,
            visibility: this.props.inheritVisibility,
            language: getCurrentLocale(),
            allowComment: this.props.inheritVisibility !== 'only_me'
        };

        let errorStep = null;
        if (this.props.articleErrors.length > 0) {
            if (this.props.articleErrors.some((error) => error.includes('Tags') || error.includes('Labels'))) {
                errorStep = 'tag';
            } else {
                errorStep = 'article';
            }
        }

        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={{
                    title: I18n.t('js.article.new.meta.title', {topic: this.props.currentTopic ? this.props.currentTopic.name : null}),
                    description: I18n.t('js.article.new.meta.description')
                }}/>

                <div className={this.props.classes.breadcrumb}>
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}/>
                    }
                </div>

                <ArticleFormDisplay form={this.props.formId}
                                    inheritVisibility={this.props.inheritVisibility}
                                    userSlug={this.props.userSlug}
                                    initialValues={initialValues}
                                    currentMode={this.props.currentMode}
                                    errorStep={errorStep}
                                    isInline={this.props.isInline}
                                    isDraft={this.props.isDraft}
                                    articleErrors={this.props.articleErrors}
                                    onCancelClick={this.props.onCancelClick}
                                    onSubmit={this.props.onSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
