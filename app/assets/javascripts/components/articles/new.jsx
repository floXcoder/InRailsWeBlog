'use strict';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';

import ArticleFormDisplay from './display/form';

import '../../modules/validation';
import 'jquery-serializejson';

export default class ArticleNew extends Reflux.Component {
    static propTypes = {
        location: React.PropTypes.object,
        multipleId: React.PropTypes.number
    };

    static contextTypes = {
        router: React.PropTypes.object
    };

    static defaultProps = {
        location: {state: {}},
        multipleId: null
    };

    state = {
        draftArticle: null,
        articleErrors: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    componentWillMount() {
        if (this.props.location.state && this.props.location.state.article) {
            this.setState({draftArticle: this.props.location.state.article});
            Materialize.toast(I18n.t('js.article.clipboard.toast.done'), 5000);
        }
    }

    componentDidMount() {
        // Mousetrap.bind('alt+s', () => {
        //     this._toggleNewForm();
        //     return false;
        // }, 'keydown');
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.articleErrors, nextState.articleErrors);
    }

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (articleData.type === 'addArticle') {
            this.context.router.history.push({
                pathname: `/article/${articleData.article.slug}`,
                state: {newTags: articleData.article.new_tags}
            });
        }

        if (articleData.type === 'addArticleError') {
            newState.articleErrors = Object.keys(articleData.articleErrors).map((errorName) => {
                let errorDescription = articleData.articleErrors[errorName];
                return I18n.t('js.article.model.' + errorName) + ' ' + errorDescription.join(I18n.t('js.helpers.and'));
            });
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    // _submitNow (event) {
    //     event.preventDefault();
    //
    //     let submitData = {};
    //
    //     _.merge(submitData, this.refs.commonFields.serialize());
    //     _.merge(submitData, this._serializeTag());
    //
    //     _.merge(submitData, {isDraft: this.refs.isDraft.state.checked});
    //     if (this.state.isLink) {
    //         _.merge(submitData, {link: this.state.isLink});
    //     }
    //
    //     if (submitData.content &&
    //         submitData.title.length > window.parameters.title_min_length &&
    //         submitData.summary.length > window.parameters.summary_min_length &&
    //         submitData.content.length > window.parameters.content_min_length) {
    //         ArticleStore.onAutosaveArticle(submitData);
    //     }
    // }

    _onCancel = () => {
        this.context.router.history.push('/');
        return true;
    };

    _handleArticleSubmit = () => {
        const $articleForm = $('#article-new' + (this.props.multipleId ? '-' + this.props.multipleId : '' ));

        const validator = $articleForm.parsley();

        if (!validator.isValid()) {
            validator.validate();
            Materialize.toast(I18n.t('js.article.common.validation_error.common'), 5000);
            return false;
        }

        let currentArticle = $articleForm.serializeJSON().article;

        ArticleActions.addArticle(currentArticle);

        return true;
    };

    render() {
        const articleFormId = 'article-new' + (this.props.multipleId ? '-' + this.props.multipleId : '' );

        return (
            <div className="blog-form">
                <ArticleFormDisplay id={articleFormId}
                                    onSubmit={this._handleArticleSubmit}
                                    onCancel={this._onCancel}
                                    articleErrors={this.state.articleErrors}>
                    {this.state.draftArticle}
                </ArticleFormDisplay>
            </div>
        );
    }
}
