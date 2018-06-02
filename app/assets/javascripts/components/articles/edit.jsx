'use strict';

import {
    deleteArticle,
    fetchArticle,
    setCurrentTags
} from '../../actions';

import articleMutationManager from './managers/mutation';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

import Loader from '../theme/loader';

@connect(null, {
    setCurrentTags
})
@articleMutationManager('edit', `article-${Utils.uuid()}`)
export default class ArticleEdit extends React.Component {
    static propTypes = {
        // From articleMutationManager
        formId: PropTypes.string.isRequired,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isInline: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        onSubmit: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags);
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.article !== nextProps.article || this.props.articleErrors !== nextProps.articleErrors || this.props.isFetching !== nextProps.isFetching;
    }

    render() {
        if (!this.props.article) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div className="blog-form blog-article-edit">
                <div className="blog-breadcrumb">
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}
                                                  article={this.props.article}/>
                    }
                </div>

                <ArticleFormDisplay form={this.props.formId}
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
