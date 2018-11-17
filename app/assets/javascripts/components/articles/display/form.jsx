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
    enableReinitialize: true,
})

@connect((state, props) => ({
    availableTags: getCategorizedTags(state, props.inheritVisibility),
    parentTags: getArticleParentTags(props.children),
    childTags: getArticleChildTags(props.children)
}), {
    fetchTags
})
class ArticleFormDisplay extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        inheritVisibility: PropTypes.string,
        isInline: PropTypes.bool,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        hasModeSelection: PropTypes.bool,
        currentMode: PropTypes.string,
        errorStep: PropTypes.string,
        articleErrors: PropTypes.array,
        // from reduxForm
        change: PropTypes.func,
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        invalid: PropTypes.bool,
        dirty: PropTypes.bool,
        // from connect
        availableTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isInline: false,
        isEditing: false,
        children: {},
        hasModeSelection: true,
        currentMode: 'story'
    };

    constructor(props) {
        super(props);
    }

    state = {
        isLink: false,
        currentMode: this.props.children.mode || this.props.currentMode,
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
        if (this.props.availableTags.length === 0) {
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

    // _handleModeClick = (mode, event) => {
    //     event.preventDefault();
    //
    //     this.setState({
    //         currentMode: mode
    //     })
    // };

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <EnsureValidity/>

                <Prompt when={this.props.dirty && !this.props.submitSucceeded}
                        message={this._onUnsavedExit}/>

                <div>
                    {
                        // this.props.hasModeSelection &&
                        // <ArticleModeField currentMode={this.state.currentMode}
                        //                   onModeClick={this._handleModeClick}/>
                    }

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
                            <ArticleCommonField currentMode={this.state.currentMode}
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
                                              availableTags={this.props.availableTags}
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
                            <ArticleAdvancedField currentMode={this.state.currentMode}
                                                  inheritVisibility={this.props.inheritVisibility}/>

                            <div className="row">
                                <div className="col s6 left-align">
                                    <Button color="default"
                                            component={Link}
                                            to={this.props.isEditing ? `/users/${this.props.userSlug}/articles/${this.props.children.slug}` : `/users/${this.props.userSlug}`}>
                                        {I18n.t('js.helpers.buttons.cancel')}
                                    </Button>
                                </div>

                                <div className="col s6 right-align">
                                    <Button color="primary"
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
