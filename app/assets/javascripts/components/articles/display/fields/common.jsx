'use strict';

import {
    Field
} from 'redux-form/immutable';

import TextField from '../../../materialize/form/text';

import EditorField from '../../../editor/form/editor';
import CategorizedField from '../../../materialize/form/categorized';
import CheckBoxField from '../../../materialize/form/checkbox';

export default class ArticleCommonField extends React.Component {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired,
        multipleId: PropTypes.number,
        article: PropTypes.object,
        userTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        isDraft: PropTypes.bool,
        onInputsChange: PropTypes.func,
        onIsLinkChange: PropTypes.func
    };

    static defaultProps = {
        article: {},
        userTags: [],
        multipleId: 0
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    _handleEditorLoaded = (editor) => {
        this._editor = editor;
    };

    _onFieldBlur = (event) => {
        if (this._editor) {
            this._editor.focus();
        }

        return event;
    };

    render() {
        return (
            <div className="row">
                {
                    this.props.currentMode === 'story' &&
                    <div className="col s12">
                        <div className="form-editor-title">
                            {I18n.t('js.article.model.title')}
                        </div>
                        <Field id="article_title"
                               multipleId={this.props.multipleId}
                               name="title"
                               icon="create"
                               placeholder={I18n.t(`js.article.common.placeholders.title.${this.props.currentMode}`)}
                               characterCount={window.settings.article_title_max_length}
                               onBlur={this._onFieldBlur}
                               component={TextField}
                               componentContent={this.props.article.title}/>
                    </div>
                }

                {
                    this.props.currentMode === 'link' &&
                    <div className="col s12">
                        <div className="form-editor-title">
                            {I18n.t('js.article.model.reference')}
                        </div>
                        <Field id="article_reference"
                               multipleId={this.props.multipleId}
                               name="reference"
                               icon="link"
                               placeholder={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                               characterCount={window.settings.article_title_max_length}
                               onBlur={this._onFieldBlur}
                               component={TextField}
                               componentContent={this.props.article.reference}/>
                    </div>
                }

                <div className="col s12">
                    <div className="form-editor-title">
                        {I18n.t('js.article.model.content')}
                    </div>
                    <Field id="article_content"
                           multipleId={this.props.multipleId}
                           name="content"
                           placeholder={I18n.t(`js.article.common.placeholders.content.${this.props.currentMode}`)}
                           onLoaded={this._handleEditorLoaded}
                           onSubmit={this.props.onSubmit}
                           component={EditorField}
                           componentContent={this.props.article.content}/>
                </div>

                <div className="col s12 xl6">
                    <Field id="article_parent_tags"
                           name="parent_tags"
                           title={I18n.t('js.article.model.parent_tags')}
                           placeholder={I18n.t('js.article.common.tags.parent')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           isSortingCategoriesByAlpha={false}
                           isHorizontal={true}
                           categorizedTags={this.props.userTags}
                           transformInitialTags={(tag) => ({category: tag.visibility, value: tag.name})}
                           component={CategorizedField}
                           componentContent={this.props.parentTags}/>
                </div>

                <div className="col s12 xl6">
                    <Field id="article_child_tags"
                           name="child_tags"
                           title={I18n.t('js.article.model.child_tags')}
                           placeholder={I18n.t('js.article.common.tags.child')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           isSortingCategoriesByAlpha={false}
                           isHorizontal={true}
                           categorizedTags={this.props.userTags}
                           transformInitialTags={(tag) => ({category: tag.visibility, value: tag.name})}
                           component={CategorizedField}
                           componentContent={this.props.childTags}/>
                </div>

                <div className="col s12 center-align">
                    <Field id="article_draft"
                           name="draft"
                           title={I18n.t('js.article.common.draft')}
                           multipleId={this.props.multipleId}
                           component={CheckBoxField}
                           componentContent={this.props.isDraft || this.props.article.draft}/>
                </div>
            </div>
        );
    }
}
