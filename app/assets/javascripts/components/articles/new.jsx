'use strict';

import {
    addArticle
} from '../../actions';

import ArticleFormDisplay from './display/form';

@connect(null, {
    addArticle
})
export default class ArticleNew extends React.PureComponent {
    static propTypes = {
        multipleId: PropTypes.number,
        // from connect
        addArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        // TODO
        // if (props.location.state && props.location.state.article) {
        //     this.state.draftArticle = props.location.state.article;
        //     Notification.success(I18n.t('js.article.clipboard.toast.done'));
        // }
    }

    state = {
        draftArticle: undefined,
        // TODO: get from redux
        articleErrors: undefined
    };

    // componentDidMount() {
    //     Mousetrap.bind('alt+s', () => {
    //         this._toggleNewForm();
    //         return false;
    //     }, 'keydown');
    // }

    _onCancel = () => {
        // TODO
        // if (this.state.article) {
        //     this.props.history.push(`/article/${this.state.article.id}`);
        // } else {
        //     this.props.history.push('/');
        // }
    };

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
                                    onCancel={this._onCancel}
                                    articleErrors={this.props.articleErrors}>
                    {this.state.draftArticle}
                </ArticleFormDisplay>
            </div>
        );
    }
}
