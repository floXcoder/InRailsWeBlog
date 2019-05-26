'use strict';

import _ from 'lodash';

import {
    Link,
    Prompt
} from 'react-router-dom';

import {
    reduxForm
} from 'redux-form/immutable';

import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

import Sticky from 'react-stickynode';

import {
    fetchTags
} from '../../../actions';

import {
    getCategorizedTags,
    getArticleParentTags,
    getArticleChildTags
} from '../../../selectors';

import {
    validateArticle
} from '../../../forms/article';

// import ArticleModeField from './fields/mode';
import ArticleFormStepper from './fields/stepper';
import ArticleTagsField from './fields/tags';
import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import EnsureValidity from '../../modules/ensureValidity';

export default @reduxForm({
    validateArticle,
    enableReinitialize: true
})
@connect((state, props) => ({
    currentUserTopicId: state.topicState.currentUserTopicId,
    availableParentTags: getCategorizedTags(state, props.inheritVisibility),
    availableChildTags: getCategorizedTags(state, props.inheritVisibility, true),
    parentTags: getArticleParentTags(props.children),
    childTags: getArticleChildTags(props.children)
}), {
    fetchTags
})
class ArticleFormDisplay extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        inheritVisibility: PropTypes.string,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        currentMode: PropTypes.string,
        errorStep: PropTypes.string,
        articleErrors: PropTypes.array,
        onCancelClick: PropTypes.func,
        // from reduxForm
        change: PropTypes.func,
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        dirty: PropTypes.bool,
        // from connect
        currentUserTopicId: PropTypes.number,
        availableParentTags: PropTypes.array,
        availableChildTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isEditing: false,
        currentMode: 'note',
        children: {}
    };

    constructor(props) {
        super(props);
    }

    state = {
        isLink: false,
        tabIndex: 0,
        prevStepError: this.props.errorStep
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errorStep && nextProps.errorStep !== prevState.prevStepError) {
            if (nextProps.errorStep === 'tag') {
                return {
                    ...prevState,
                    tabIndex: 1,
                    prevStepError: nextProps.errorStep
                };
            } else if (nextProps.errorStep === 'article') {
                return {
                    ...prevState,
                    tabIndex: 0,
                    prevStepError: nextProps.errorStep
                };
            }
        }

        return null;
    }

    componentDidMount() {
        if (this.props.availableParentTags.length === 0) {
            this.props.fetchTags({availableTags: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // For each change in form, reduxForm reload the all form
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    _onUnsavedExit = (location) => {
        return I18n.t('js.article.form.unsaved');
    };

    _handleTabChange = (event, value) => {
        this.setState({tabIndex: value});
    };

    _handleButtonChange = (index) => {
        this.setState({tabIndex: index});
    };

    render() {
        const currentMode = this.props.children.mode || this.props.currentMode;

        return (
            <form onSubmit={this.props.handleSubmit}>
                <EnsureValidity/>

                <Prompt when={this.props.dirty && !(this.props.submitSucceeded || this.props.submitting)}
                        message={this._onUnsavedExit}/>

                <div>
                    <Sticky enabled={true}
                            top="header">
                        <ArticleFormStepper tabIndex={this.state.tabIndex}
                                            onTabChange={this._handleTabChange}/>
                    </Sticky>

                    <div className="margin-bottom-30">
                        {
                            this.props.articleErrors &&
                            <ArticleErrorField errors={this.props.articleErrors}/>
                        }

                        <Collapse in={this.state.tabIndex === 0}>
                            <ArticleCommonField currentMode={currentMode}
                                                currentTopicId={this.props.currentUserTopicId}
                                                article={this.props.children}
                                                change={this.props.change}
                                                onSubmit={this.props.handleSubmit}/>

                            <div className="center-align margin-top-20">
                                <Button color="primary"
                                        variant="outlined"
                                        onClick={this._handleButtonChange.bind(this, 1)}>
                                    {I18n.t('js.article.form.next')}
                                </Button>
                            </div>
                        </Collapse>

                        <Collapse in={this.state.tabIndex === 1}>
                            <ArticleTagsField article={this.props.children}
                                              availableParentTags={this.props.availableParentTags}
                                              availableChildTags={this.props.availableChildTags}
                                              parentTags={this.props.parentTags}
                                              childTags={this.props.childTags}
                                              onSubmit={this.props.handleSubmit}/>

                            <div className="center-align margin-top-30">
                                <Button color="primary"
                                        variant="outlined"
                                        onClick={this._handleButtonChange.bind(this, 2)}>
                                    {I18n.t('js.article.form.next')}
                                </Button>
                            </div>
                        </Collapse>

                        <Collapse in={this.state.tabIndex === 2}>
                            <ArticleAdvancedField currentMode={currentMode}
                                                  inheritVisibility={this.props.inheritVisibility}/>

                            <div className="row">
                                <div className="col s6 left-align">
                                    <Button color="default"
                                            size="small"
                                            component={Link}
                                            to={this.props.isEditing ? `/users/${this.props.userSlug}/articles/${this.props.children.slug}` : `/users/${this.props.userSlug}`}
                                    onClick={this.props.onCancelClick}>
                                        {I18n.t('js.helpers.buttons.cancel')}
                                    </Button>
                                </div>

                                <div className="col s6 right-align">
                                    <Button color="primary"
                                            variant="outlined"
                                            disabled={this.props.submitting}
                                            onClick={this.props.handleSubmit}>
                                        {
                                            this.props.isEditing
                                                ?
                                                I18n.t('js.article.edit.submit')
                                                :
                                                I18n.t('js.article.new.submit')
                                        }
                                    </Button>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </form>
        );
    }
}
