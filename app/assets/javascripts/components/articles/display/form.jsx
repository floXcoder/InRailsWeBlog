'use strict';

import {
    Link,
    // Prompt
} from 'react-router-dom';

import {
    Form
} from 'react-final-form';

import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Sticky from 'react-sticky-el';

import {
    userArticlePath,
    userHomePath,
    editInventoriesTopicPath
} from '../../../constants/routesHelper';

import {
    fetchTags
} from '../../../actions';

import {
    getCategorizedTags,
    getArticleParentTags,
    getArticleChildTags
} from '../../../selectors';

// import {
//     removeLocalData
// } from '../../../middlewares/localStorage';

import {
    validateArticle
} from '../../../forms/article';

import {
    headerMargin,
    // articleTemporaryDataName
} from '../../modules/constants';

// import ArticleModeField from './fields/mode';
import ArticleFormStepper from './fields/stepper';
import ArticleTagsField from './fields/tags';
import ArticleCommonField from './fields/common';
import ArticleInventoriesField from './fields/inventories';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import EnsureValidity from '../../modules/ensureValidity';


export default @connect((state, props) => ({
    availableParentTags: getCategorizedTags(state, props.inheritVisibility),
    availableChildTags: getCategorizedTags(state, props.inheritVisibility, true),
    parentTags: getArticleParentTags(props.children),
    childTags: getArticleChildTags(props.children)
}), {
    fetchTags
})
class ArticleFormDisplay extends React.Component {
    static propTypes = {
        currentTopic: PropTypes.object.isRequired,
        article: PropTypes.object.isRequired,
        userSlug: PropTypes.string.isRequired,
        onFormChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        isPaste: PropTypes.bool,
        inheritVisibility: PropTypes.string,
        isEditing: PropTypes.bool,
        currentUser: PropTypes.object,
        currentMode: PropTypes.string,
        errorStep: PropTypes.string,
        articleErrors: PropTypes.array,
        onCancel: PropTypes.func,
        children: PropTypes.object,
        // from connect
        availableParentTags: PropTypes.array,
        availableChildTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isPaste: false,
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
        return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    // _onUnsavedExit = () => {
    //     removeLocalData(articleTemporaryDataName);
    //
    //     return I18n.t('js.article.form.unsaved');
    // };

    _handleTabChange = (event, index) => {
        this.setState({
            tabIndex: index
        }, () => {
            window.scroll({top: headerMargin, behavior: 'smooth'});
        });
    };

    _handleButtonChange = (index) => {
        this.setState({
            tabIndex: index
        }, () => {
            window.scroll({top: headerMargin, behavior: 'smooth'});
        });
    };

    render() {
        const currentMode = this.props.children.mode || this.props.currentMode;

        return (
            <Form initialValues={this.props.article}
                  debug={this.props.onFormChange}
                  validate={validateArticle}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, dirty, submitting, values, form: {change}}) => {
                        const isNextDisabled = submitting || (this.props.currentTopic.mode === 'inventories' && this.props.currentTopic.inventoryFields.length === 0);

                        return (
                            <form className="article-form-form"
                                  onSubmit={handleSubmit}>
                                <EnsureValidity/>

                                {/*<Prompt when={dirty && !submitting}*/}
                                {/*        message={this._onUnsavedExit}/>*/}

                                <Sticky boundaryElement=".article-form-form"
                                        // topOffset={-headerMargin / 2}
                                        topOffset={headerMargin}
                                        bottomOffset={320}
                                        hideOnBoundaryHit={false}>
                                    <div className="article-form-stepper">
                                        <ArticleFormStepper tabIndex={this.state.tabIndex}
                                                            onTabChange={this._handleTabChange}/>
                                    </div>
                                </Sticky>

                                <div className="margin-bottom-30">
                                    {
                                        this.props.articleErrors &&
                                        <ArticleErrorField errors={this.props.articleErrors}/>
                                    }

                                    <Collapse in={this.state.tabIndex === 0}>
                                        {
                                            this.props.currentTopic.mode === 'inventories'
                                                ?
                                                <ArticleInventoriesField currentUserId={this.props.currentUser.id}
                                                                         currentTopicId={this.props.currentTopic.id}
                                                                         inventoryFields={this.props.currentTopic.inventoryFields}
                                                                         article={this.props.children}
                                                                         change={change}/>
                                                :
                                                <ArticleCommonField currentMode={currentMode}
                                                                    currentUserId={this.props.currentUser.id}
                                                                    currentTopicId={this.props.currentTopic.id}
                                                                    topicLanguages={this.props.currentTopic.languages}
                                                                    isPaste={this.props.isPaste}
                                                                    article={this.props.children}
                                                                    change={change}
                                                                    onSubmit={handleSubmit}/>
                                        }

                                        {
                                            (this.props.currentTopic.mode === 'inventories' && this.props.currentTopic.inventoryFields.length === 0) &&
                                            <div className="center-align margin-bottom-75">
                                                <Typography variant="h5"
                                                            gutterBottom={true}>
                                                    {I18n.t('js.article.form.no_inventories')}
                                                </Typography>

                                                <Button className="margin-top-25"
                                                        color="primary"
                                                        variant="contained"
                                                        component={Link}
                                                        to={editInventoriesTopicPath(this.props.currentUser.slug, this.props.currentTopic.slug)}>
                                                    {I18n.t('js.article.form.inventory_button')}
                                                </Button>
                                            </div>
                                        }

                                        <div className="center-align margin-top-20">
                                            <div className="row">
                                                <div className="col s12 margin-bottom-15">
                                                    <Button color="primary"
                                                            variant="outlined"
                                                            disabled={isNextDisabled}
                                                            onClick={this._handleButtonChange.bind(this, 1)}>
                                                        {I18n.t('js.article.form.next')}
                                                    </Button>
                                                </div>

                                                {
                                                    (this.props.currentTopic.mode === 'inventories' && this.props.currentTopic.inventoryFields.length > 0) &&
                                                    <div className="col s12 margin-top-25 margin-bottom-25">
                                                        <Button style={{
                                                            color: '#aaa'
                                                        }}
                                                                variant="text"
                                                                size="small"
                                                                component={Link}
                                                                to={editInventoriesTopicPath(this.props.currentUser.slug, this.props.currentTopic.slug)}>
                                                            {I18n.t('js.article.form.inventory_button')}
                                                        </Button>
                                                    </div>
                                                }

                                                <div className="col s12 margin-top-25">
                                                    <Button size="small"
                                                            component={Link}
                                                            to={this.props.isEditing ? userArticlePath(this.props.userSlug, this.props.children.slug) : userHomePath(this.props.userSlug)}
                                                            onClick={this.props.onCancel}>
                                                        {I18n.t('js.helpers.buttons.cancel')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Collapse>

                                    <Collapse in={this.state.tabIndex === 1}>
                                        <ArticleTagsField article={this.props.children}
                                                          availableParentTags={this.props.availableParentTags}
                                                          availableChildTags={this.props.availableChildTags}
                                                          parentTags={this.props.parentTags}
                                                          childTags={this.props.childTags}
                                                          onSubmit={handleSubmit}/>

                                        <div className="center-align margin-top-30">
                                            <Button color="primary"
                                                    variant="outlined"
                                                    disabled={isNextDisabled}
                                                    onClick={this._handleButtonChange.bind(this, 2)}>
                                                {I18n.t('js.article.form.next')}
                                            </Button>
                                        </div>
                                    </Collapse>

                                    <Collapse in={this.state.tabIndex === 2}>
                                        <ArticleAdvancedField currentMode={currentMode}
                                                              isEditing={this.props.isEditing}
                                                              inheritVisibility={this.props.inheritVisibility}
                                                              currentVisibility={values.visibility}
                                                              currentDraft={values.draft}
                                                              change={change}/>

                                        <div className="row">
                                            <div className="col s6 left-align">
                                                <Button
                                                    size="small"
                                                    component={Link}
                                                    to={this.props.isEditing ? userArticlePath(this.props.userSlug, this.props.children.slug) : userHomePath(this.props.userSlug)}
                                                    onClick={this.props.onCancel}>
                                                    {I18n.t('js.helpers.buttons.cancel')}
                                                </Button>
                                            </div>

                                            <div className="col s6 right-align">
                                                <Button color="primary"
                                                        variant="outlined"
                                                        disabled={submitting}
                                                        onClick={handleSubmit}>
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
                            </form>
                        );
                    }
                }
            </Form>
        );
    }
}
