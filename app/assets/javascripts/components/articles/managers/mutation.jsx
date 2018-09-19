'use strict';

import _ from 'lodash';

import {
    isDirty,
    isValid,
    isSubmitting,
    getFormValues
} from 'redux-form/immutable';

import {
    saveLocalData,
    getLocalData,
    removeLocalData
} from '../../../middlewares/localStorage';

import {
    switchUserLogin,
    addArticle,
    fetchArticle,
    updateArticle
} from '../../../actions';

import {
    getTopicTags,
    getCurrentUser,
    getCurrentTopic,
    getArticleErrors
} from '../../../selectors';

import {
    formatTagArticles
} from '../../../forms/article';

import {
    getDisplayName
} from '../../modules/common';

export default function articleMutationManager(mode, formId) {
    return function articleMutation(WrappedComponent) {
        @connect((state) => ({
            isUserConnected: state.userState.isConnected,
            currentUser: getCurrentUser(state),
            currentTopic: getCurrentTopic(state),
            tags: getTopicTags(state),
            isFetching: state.articleState.isFetching,
            article: mode === 'edit' ? state.articleState.article : undefined,
            articleErrors: getArticleErrors(state),
            isDirty: isDirty(formId)(state),
            isValid: isValid(formId)(state),
            isSubmitting: isSubmitting(formId)(state),
            formValues: getFormValues(formId)(state)
        }), {
            switchUserLogin,
            addArticle,
            fetchArticle,
            updateArticle
        })
        class ArticleMutationComponent extends React.Component {
            static displayName = `ArticleMutationManager(${getDisplayName(WrappedComponent)})`;

            static waitTimeBeforeSaving = 20000;
            static temporaryDataName = 'article-temporary';
            static unsavedDataName = 'article-unsaved';

            static propTypes = {
                params: PropTypes.object.isRequired,
                history: PropTypes.object.isRequired,
                initialData: PropTypes.object,
                // From connect
                isUserConnected: PropTypes.bool,
                currentUser: PropTypes.object,
                currentTopic: PropTypes.object,
                tags: PropTypes.array,
                isFetching: PropTypes.bool,
                article: PropTypes.object,
                articleErrors: PropTypes.array,
                isDirty: PropTypes.bool,
                isValid: PropTypes.bool,
                isSubmitting: PropTypes.bool,
                formValues: PropTypes.object,
                switchUserLogin: PropTypes.func,
                addArticle: PropTypes.func,
                fetchArticle: PropTypes.func,
                updateArticle: PropTypes.func
            };

            constructor(props) {
                super(props);

                // Check fo unsaved article before connection
                const unsavedArticle = getLocalData(ArticleMutationComponent.unsavedDataName, true);

                if (props.params.articleSlug) {
                    props.fetchArticle(props.params.articleSlug);
                } else if (props.initialData) {
                    this.state.article = props.initialData;

                    if (props.initialData.parentTagSlug) {
                        this.state.article = this.state.article || {};

                        this.state.article.tags = props.tags.filter((tag) => tag.slug === props.initialData.parentTagSlug || tag.slug === props.initialData.childTagSlug);
                        this.state.article.parentTagSlugs = [props.initialData.parentTagSlug];
                        if (props.initialData.childTagSlug) {
                            this.state.article.childTagSlugs = [props.initialData.childTagSlug];
                        }
                    }

                    if (props.initialData.temporary) {
                        const temporaryArticle = getLocalData(ArticleMutationComponent.temporaryDataName, true);
                        if (temporaryArticle && temporaryArticle.length > 0) {
                            this.state.article = temporaryArticle.first().article;
                        }
                    }

                    if (props.initialData.content) {
                        Notification.success(I18n.t('js.article.clipboard'));
                    }
                } else if (unsavedArticle && unsavedArticle.length > 0) {
                    this.state.article = unsavedArticle.first().article;
                    this.props.addArticle(this.state.article)
                        .then((response) => {
                            if (response.article) {
                                this.props.history.push({
                                    pathname: `/article/${response.article.slug}`,
                                    state: {reloadTags: true}
                                });
                            }
                        });
                }
            }

            state = {
                article: undefined
            };

            static getDerivedStateFromProps(nextProps, prevState) {
                if (nextProps.article && prevState.article !== nextProps.article) {
                    return {
                        article: nextProps.article
                    };
                }

                return null;
            }

            // Utility? Performance are the same...
            // shouldComponentUpdate(nextProps) {
            //     return (this.props.tags !== nextProps.tags || this.props.articleErrors !== nextProps.articleErrors || this.props.isFetching !== nextProps.isFetching || this.props.article !== nextProps.article);
            // }

            componentDidUpdate(prevProps) {
                if (prevProps.isDirty && prevProps.isValid && !prevProps.isSubmitting && prevProps.formValues !== this.props.formValues) {
                    // this._handleChange(this.props.formValues);
                }

                this._promptUnsavedChange(this.props.isDirty);
            }

            componentWillUnmount() {
                window.onbeforeunload = null;

                // this._handleChange.cancel();
            }

            _promptUnsavedChange = (isUnsaved = false) => {
                const leaveMessage = I18n.t('js.article.form.unsaved');

                // Detecting browser close
                window.onbeforeunload = isUnsaved ? (() => leaveMessage) : null;
            };

            // _handleChange = _.debounce((values) => {
            //     this._handleSubmit(values, true);
            // }, ArticleMutationComponent.waitTimeBeforeSaving);

            _handleSubmit = (values, autoSave = false) => {
                if (!values) {
                    return;
                }

                let formData = values.toJS();

                if (this.state.article && this.state.article.id) {
                    formData.id = this.props.article.id;

                    formatTagArticles(formData, this.props.article.tags.toJS(), {
                        parentTagIds: this.props.article.parentTagIds.length === 0 ? this.props.article.tags.map((tag) => tag.id) : this.props.article.parentTagIds,
                        childTagIds: this.props.article.childTagIds
                    });

                    this.props.updateArticle(formData, {autoSave})
                        .then((response) => {
                            if (response.article && autoSave !== true) {
                                this.props.history.push({
                                    pathname: `/article/${response.article.slug}`,
                                    state: {reloadTags: true}
                                });
                            }
                        });
                } else {
                    let tagParams = {};
                    if (this.state.article) {
                        tagParams = {
                            parentTagSlugs: this.state.article.parentTagSlugs,
                            childTagSlugs: this.state.article.childTagSlugs
                        };
                    }

                    formatTagArticles(formData, this.state.article && this.state.article.tags, tagParams);

                    // Merge previous data if any
                    if (this.state.article) {
                        formData = {...this.state.article, ...formData};
                    }

                    if (!formData.visibility && this.props.currentTopic && this.props.currentTopic.visibility === 'only_me') {
                        formData.visibility = 'only_me';
                    }

                    if (formData.visibility === 'only_me' && typeof formData.allow_comment === 'undefined') {
                        formData.allow_comment = false;
                    }

                    if (autoSave === true) {
                        saveLocalData(ArticleMutationComponent.temporaryDataName, {
                            article: formData
                        }, false);
                    } else {
                        if (!this.props.isUserConnected) {
                            // Save article in local storage to get it back after reload
                            saveLocalData(ArticleMutationComponent.unsavedDataName, {
                                article: formData
                            }, false);

                            Notification.alert(I18n.t('js.article.common.not_connected.message'));

                            this.props.switchUserLogin();
                        } else {
                            removeLocalData(ArticleMutationComponent.temporaryDataName);
                            removeLocalData(ArticleMutationComponent.unsavedDataName);

                            this.props.addArticle(formData)
                                .then((response) => {
                                    if (response.article) {
                                        this.props.history.push({
                                            pathname: `/article/${response.article.slug}`,
                                            state: {reloadTags: true}
                                        });
                                    }
                                });
                        }
                    }
                }
            };

            render() {
                const currentMode = this.props.initialData && this.props.initialData.mode;
                const isInline = this.props.initialData && this.props.initialData.mode === 'note';
                const isDraft = this.props.initialData ? this.props.initialData.isDraft : false;

                // Ensure article is correct (do not use previous one)
                let article = this.state.article;
                if (mode === 'edit' && this.state.article && this.state.article.slug !== this.props.params.articleSlug) {
                    article = undefined;
                }

                const propsProxy = {
                    currentUser: this.props.currentUser,
                    currentTopic: this.props.currentTopic,
                    formId: formId,
                    onSubmit: this._handleSubmit,
                    article: article,
                    currentMode: currentMode,
                    isInline: isInline,
                    isDraft: isDraft,
                    articleErrors: this.props.articleErrors
                };

                return <WrappedComponent {...propsProxy}/>;
            }
        }

        return ArticleMutationComponent;
    }
}
