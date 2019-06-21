'use strict';

import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

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
    showUserLogin,
    addArticle,
    fetchArticle,
    updateArticle
} from '../../../actions';

import {
    getTopicTags,
    getCurrentUser,
    getCurrentUserTopic,
    getArticleErrors
} from '../../../selectors';

import {
    formatTagArticles
} from '../../../forms/article';

import {
    getDisplayName
} from '../../modules/common';

import {
    articleWaitTimeBeforeSaving,
    articleTemporaryDataName,
    articleUnsavedDataName
} from '../../modules/constants';

export default function articleMutationManager(mode, formId) {
    return function articleMutation(WrappedComponent) {
        @withRouter
        @connect((state) => ({
            isUserConnected: state.userState.isConnected,
            currentUser: getCurrentUser(state),
            currentTopic: getCurrentUserTopic(state),
            tags: getTopicTags(state),
            isFetching: state.articleState.isFetching,
            article: mode === 'edit' ? state.articleState.article : undefined,
            articleErrors: getArticleErrors(state),
            isDirty: isDirty(formId)(state),
            isValid: isValid(formId)(state),
            isSubmitting: isSubmitting(formId)(state),
            formValues: getFormValues(formId)(state)
        }), {
            showUserLogin,
            addArticle,
            fetchArticle,
            updateArticle
        })
        class ArticleMutationComponent extends React.Component {
            static displayName = `ArticleMutationManager(${getDisplayName(WrappedComponent)})`;

            static propTypes = {
                routeParams: PropTypes.object.isRequired,
                routeState: PropTypes.object,
                // from router
                history: PropTypes.object,
                // from connect
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
                showUserLogin: PropTypes.func,
                addArticle: PropTypes.func,
                fetchArticle: PropTypes.func,
                updateArticle: PropTypes.func
            };

            constructor(props) {
                super(props);

                // Check fo unsaved article before connection
                const unsavedArticle = getLocalData(articleUnsavedDataName, true);

                if (props.routeParams.articleSlug) {
                    props.fetchArticle(props.routeParams.articleSlug, {edit: true});
                } else if (props.routeState) {
                    this.state.article = props.routeState;

                    if (props.routeState.parentTagSlug) {
                        this.state.article = this.state.article || {};

                        this.state.article.tags = props.tags.filter((tag) => tag.slug === props.routeState.parentTagSlug || tag.slug === props.routeState.childTagSlug);
                        this.state.article.parentTagSlugs = [props.routeState.parentTagSlug];
                        if (props.routeState.childTagSlug) {
                            this.state.article.childTagSlugs = [props.routeState.childTagSlug];
                        }
                    }

                    if (props.routeState.temporary) {
                        const temporaryArticle = getLocalData(articleTemporaryDataName, true);
                        if (temporaryArticle && temporaryArticle.article) {
                            this.state.article = temporaryArticle.article;
                        }
                    }

                    if (props.routeState.content) {
                        Notification.success(I18n.t('js.article.clipboard'));
                    }
                } else if (unsavedArticle && unsavedArticle.length > 0) {
                    this.state.article = unsavedArticle.first().article;
                    this.props.addArticle(this.state.article)
                        .then((response) => {
                            if (response.article) {
                                this.props.history.push({
                                    pathname: `/users/${response.article.user.slug}/articles/${response.article.slug}`,
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

            componentDidUpdate(prevProps) {
                if (prevProps.isDirty && prevProps.isValid && !prevProps.isSubmitting && prevProps.formValues !== this.props.formValues) {
                    this._handleChange(this.props.formValues);
                }

                this._promptUnsavedChange(this.props.isDirty);
            }

            componentWillUnmount() {
                window.onbeforeunload = null;

                this._handleChange.cancel();
            }

            _promptUnsavedChange = (isUnsaved = false) => {
                const leaveMessage = I18n.t('js.article.form.unsaved');

                // Detecting browser close
                window.onbeforeunload = isUnsaved ? (() => leaveMessage) : null;
            };

            _handleCancel = () => {
                if (this.state.article && this.state.article.id) {
                    return;
                }

                const temporaryArticle = getLocalData(articletemporaryDataName);
                if (temporaryArticle && temporaryArticle.length > 0) {
                    removeLocalData(articletemporaryDataName);
                }
            };

            _handleChange = _.debounce((values) => {
                this._handleSubmit(values, true);
            }, articleWaitTimeBeforeSaving);

            _handleSubmit = (values, autoSave = false) => {
                if (!values) {
                    return;
                }

                let formData = values.toJS();

                // If article exists update the current article
                if (this.state.article && this.state.article.id) {
                    formData.id = this.props.article.id;

                    formatTagArticles(formData, this.props.article.tags.toJS(), {
                        parentTagIds: this.props.article.parentTagIds.length === 0 ? this.props.article.tags.map((tag) => tag.id) : this.props.article.parentTagIds,
                        childTagIds: this.props.article.childTagIds
                    });

                    const updatePromise = this.props.updateArticle(formData, {autoSave});
                    if (autoSave === true) {
                        return updatePromise;
                    } else {
                        return updatePromise.then((response) => {
                            if (response.errors) {
                                return;
                            }

                            this.props.history.push({
                                pathname: `/users/${response.article.user.slug}/articles/${response.article.slug}`,
                                state: {reloadTags: true}
                            });
                        });
                    }
                    // For new articles, save it locally only
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
                        saveLocalData(articleTemporaryDataName, {
                            article: formData
                        }, false);
                    } else {
                        if (!this.props.isUserConnected) {
                            // Save article in local storage to get it back after reload
                            saveLocalData(articleUnsavedDataName, {
                                article: formData
                            }, false);

                            Notification.alert(I18n.t('js.article.common.not_connected.message'));

                            this.props.showUserLogin();
                        } else {
                            removeLocalData(articleTemporaryDataName);
                            removeLocalData(articleUnsavedDataName);

                            return this.props.addArticle(formData)
                                .then((response) => {
                                    if (response.article) {
                                        this.props.history.push({
                                            pathname: `/users/${response.article.user.slug}/articles/${response.article.slug}`,
                                            state: {reloadTags: true}
                                        });
                                    }
                                });
                        }
                    }
                }
            };

            render() {
                let currentMode = (this.props.routeState && this.props.routeState.mode) || 'note';
                if (this.props.currentTopic && this.props.currentTopic.mode === 'stories') {
                    currentMode = 'story';
                }

                const isDraft = this.props.routeState ? this.props.routeState.isDraft : false;

                // Ensure current article is correct (do not use previous edited article)
                let article = this.state.article;
                if (mode === 'edit' && this.state.article && this.state.article.id !== this.props.article.id) {
                    article = undefined;
                }

                const propsProxy = {
                    currentUser: this.props.currentUser,
                    currentTopic: this.props.currentTopic,
                    formId: formId,
                    onCancelClick: this._handleCancel,
                    onSubmit: this._handleSubmit,
                    article: article,
                    currentMode: currentMode,
                    isDraft: isDraft,
                    articleErrors: this.props.articleErrors
                };

                return <WrappedComponent {...propsProxy}/>;
            }
        }

        return ArticleMutationComponent;
    }
}
