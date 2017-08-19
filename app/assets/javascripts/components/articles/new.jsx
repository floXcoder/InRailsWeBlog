'use strict';

import _ from 'lodash';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';

import ArticleFormDisplay from './display/form';

import '../../modules/validation';
import 'jquery-serializejson';

export default class ArticleNew extends Reflux.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object,
        multipleId: PropTypes.number
    };

    static defaultProps = {
        location: {state: {}},
        multipleId: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    state = {
        draftArticle: null,
        articleErrors: null
    };

    componentWillMount() {
        if (this.props.location.state && this.props.location.state.article) {
            this.setState({draftArticle: this.props.location.state.article});
            Notification.success(I18n.t('js.article.clipboard.toast.done'));
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
            this.props.router.history.push({
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
    //         submitData.title.length > window.settings.title_min_length &&
    //         submitData.summary.length > window.settings.summary_min_length &&
    //         submitData.content.length > window.settings.content_min_length) {
    //         ArticleStore.onAutosaveArticle(submitData);
    //     }
    // }

    _onCancel = () => {
        this.props.router.history.push('/');
        return true;
    };

    _handleArticleSubmit = () => {
        const $articleForm = $('#article-new' + (this.props.multipleId ? '-' + this.props.multipleId : '' ));

        const validator = $articleForm.parsley();

        if (!validator.isValid()) {
            validator.validate();
            Notification.error(I18n.t('js.article.common.validation_error.common'));
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
