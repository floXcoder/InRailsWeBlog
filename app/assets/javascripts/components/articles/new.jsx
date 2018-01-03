'use strict';

import {
    addArticle
} from '../../actions';

import {
    getArticleErrors
} from '../../selectors';

import ArticleFormDisplay from './display/form';

@connect((state) => ({
    articleErrors: getArticleErrors(state)
}), {
    addArticle
})
export default class ArticleNew extends React.PureComponent {
    static propTypes = {
        params: PropTypes.object.isRequired,
        initialData: PropTypes.object,
        multipleId: PropTypes.number,
        // from connect
        articleErrors: PropTypes.array,
        addArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        if (props.initialData && props.initialData.article) {
            this.state.article = props.initialData.article;
            Notification.success(I18n.t('js.article.clipboard.toast.done'));
        }
    }

    state = {
        article: false
    };

    // componentDidMount() {
    //     Mousetrap.bind('alt+s', () => {
    //         this._toggleNewForm();
    //         return false;
    //     }, 'keydown');
    // }

    _handleSubmit = (values) => {
        this.props.addArticle(values.toJS());
        // TODO: utility ?
        // this.props.push({
        //     pathname: `/article/${articleData.article.slug}`,
        //     state: {newTags: articleData.article.new_tags}
        // });

        return true;
    };

    render() {
        const articleFormId = 'article-new' + (this.props.multipleId ? '-' + this.props.multipleId : '');

        return (
            <div className="blog-form">
                <ArticleFormDisplay id={articleFormId}
                                    onSubmit={this._handleSubmit}
                                    articleErrors={this.props.articleErrors}>
                    {this.state.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
