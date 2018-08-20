'use strict';

import {
    Link,
    Prompt
} from 'react-router-dom';

import {
    reduxForm,
    Field
} from 'redux-form/immutable';

import {
    validateTag
} from '../../../forms/tag';

import TagErrorField from './fields/error';

import TextField from '../../materialize/form/text';
import SelectField from '../../materialize/form/select';
import SelecterField from '../../theme/form/selecter';
import EditorField from '../../editor/form/editor';

import Submit from '../../materialize/submit';

@reduxForm({
    form: 'tag',
    validateTag
})
export default class TagFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        tagId: PropTypes.number.isRequired,
        multipleId: PropTypes.number,
        isInline: PropTypes.bool,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        tagErrors: PropTypes.array,
        // From reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        invalid: PropTypes.bool,
        dirty: PropTypes.bool
    };

    static defaultProps = {
        isInline: false,
        isEditing: false,
        children: {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form id={this.props.id}
                  className="tag-form"
                  onSubmit={this.props.handleSubmit}>
                <Prompt
                    when={this.props.dirty && !this.props.submitSucceeded}
                    message={location => I18n.t('js.tag.form.unsaved', {location: location.pathname})}/>

                <div className="card">
                    <h4 className="blog-form-title">
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.tag.edit.title', {name: this.props.children.name})
                                :
                                I18n.t('js.tag.new.title')
                        }
                    </h4>

                    <div className="form-editor-card">
                        <div className="row">
                            {
                                this.props.tagErrors &&
                                <div className="col s12">
                                    <TagErrorField errors={this.props.tagErrors}/>
                                </div>
                            }

                            <div className="col s12">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="form-editor-title">
                                            {I18n.t('js.tag.model.name')}
                                        </div>
                                        <Field id="tag_name"
                                               multipleId={this.props.multipleId}
                                               name="name"
                                               icon="create"
                                               placeholder={I18n.t('js.tag.common.placeholders.name')}
                                               characterCount={window.settings.tag_name_max_length}
                                               isDisabled={this.props.children.visibility === 'everyone'}
                                               component={TextField}
                                               componentContent={this.props.children.name}/>

                                        {
                                            this.props.children.visibility === 'everyone' &&
                                                <p className="tag-advice">
                                                    {I18n.t('js.tag.common.visibility_immutable')}
                                                </p>
                                        }
                                    </div>

                                    <div className="col s12">
                                        <div className="form-editor-title">
                                            {I18n.t('js.tag.model.description')}
                                        </div>
                                        <Field id="tag_description"
                                               modelName="tag"
                                               modelId={this.props.tagId}
                                               name="description"
                                               placeholder={I18n.t('js.tag.common.placeholders.description')}
                                               onSubmit={this.props.handleSubmit}
                                               component={EditorField}
                                               componentContent={this.props.children.description}/>
                                    </div>

                                    <div className="col s12">
                                        <div className="form-editor-title">
                                            {I18n.t('js.tag.model.visibility')}
                                        </div>
                                        <Field id="tag_visibility"
                                               multipleId={this.props.multipleId}
                                               name="visibility"
                                               title={I18n.t('js.tag.model.visibility')}
                                               default={I18n.t('js.tag.common.visibility')}
                                               options={I18n.t('js.tag.enums.visibility')}
                                               component={SelectField}
                                               componentContent={this.props.children.visibility}/>
                                    </div>

                                    <div className="col s12">
                                        <div className="form-editor-title">
                                            {I18n.t('js.tag.model.synonyms')}
                                        </div>
                                        <Field id="tag_synonyms"
                                               multipleId={this.props.multipleId}
                                               name="synonyms"
                                               elements={[]}
                                               title={I18n.t('js.tag.model.synonyms')}
                                               placeholder={I18n.t('js.tag.common.synonyms')}
                                               isEditing={true}
                                               isHorizontal={true}
                                               isMultiple={true}
                                               component={SelecterField}
                                               componentContent={this.props.children.synonyms}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link className="btn-flat waves-effect waves-teal"
                                      to={this.props.isEditing ? `/tag/${this.props.children.slug}` : '/'}>
                                    {I18n.t('js.tag.edit.back_button')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="tag-submit"
                                        icon="send"
                                        disabled={this.props.submitting}
                                        onSubmit={this.props.handleSubmit}>
                                    {
                                        this.props.isEditing
                                            ?
                                            I18n.t('js.tag.edit.submit')
                                            :
                                            I18n.t('js.tag.new.submit')
                                    }
                                </Submit>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
