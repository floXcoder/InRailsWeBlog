'use strict';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

import articleMutationManager from './managers/mutation';

@articleMutationManager(`article-${Utils.uuid()}`)
export default class ArticleNew extends React.Component {
    static propTypes = {
        // From articleMutationManager
        formId: PropTypes.string.isRequired,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        article: PropTypes.object,
        isInline: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        onSubmit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.articleErrors !== nextProps.articleErrors;
    }

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

                <ArticleFormDisplay form={this.props.formId}
                                    currentMode={this.props.currentMode}
                                    isInline={this.props.isInline}
                                    isDraft={this.props.isDraft}
                                    articleErrors={this.props.articleErrors}
                                    onSubmit={this.props.onSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
