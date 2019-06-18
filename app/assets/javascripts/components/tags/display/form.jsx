'use strict';

import {
    Prompt,
    Link
} from 'react-router-dom';

import {
    reduxForm,
    Field
} from 'redux-form/immutable';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {
    validateTag
} from '../../../forms/tag';

import TagErrorField from './fields/error';

import EditorField from '../../editor/form/editor';

import TextFormField from '../../material-ui/form/text';
import SelectFormField from '../../material-ui/form/select';
import AutocompleteFormField from '../../material-ui/form/autocomplete';

import styles from '../../../../jss/tag/form';

export default @reduxForm({
    form: 'tag',
    validateTag,
    enableReinitialize: true,
})
@withStyles(styles)
class TagFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        tagId: PropTypes.number.isRequired,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        tagErrors: PropTypes.array,
        // from reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        dirty: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isEditing: false,
        children: {}
    };

    constructor(props) {
        super(props);
    }

    _onUnsavedExit = (location) => {
        return I18n.t('js.tag.form.unsaved', {location: location.pathname});
    };

    render() {
        return (
            <form id={this.props.id}
                  onSubmit={this.props.handleSubmit}>
                <Prompt when={this.props.dirty && !this.props.submitSucceeded}
                        message={this._onUnsavedExit}/>

                <div>
                    <div className="row">
                        {
                            this.props.children.name &&
                            <div className="col s12">
                                <h1>
                                    {I18n.t('js.tag.edit.title', {tag: this.props.children.name})}
                                </h1>
                            </div>
                        }

                        {
                            this.props.tagErrors &&
                            <div className="col s12">
                                <TagErrorField errors={this.props.tagErrors}/>
                            </div>
                        }

                        <div className="col s12">
                            <Field name="name"
                                   component={TextFormField}
                                   className={this.props.classes.name}
                                   InputLabelProps={{
                                       classes: {
                                           root: this.props.classes.nameLabel
                                       }
                                   }}
                                   InputProps={{
                                       classes: {
                                           underline: !this.props.children.name && this.props.classes.nameUnderline
                                       }
                                   }}
                                   id="tag_name"
                                   label={I18n.t('js.tag.common.placeholders.name')}
                                   autoFocus={true}
                                   required={true}
                                   color="primary"
                                   disabled={this.props.children.visibility === 'everyone'}/>

                            {
                                this.props.children.visibility === 'everyone' &&
                                <p className="tag-advice">
                                    {I18n.t('js.tag.common.visibility_immutable')}
                                </p>
                            }
                        </div>

                        <div className="col s12">
                            <div className={this.props.classes.categoryTitle}>
                                {I18n.t('js.tag.model.description')}
                            </div>
                            <Field name="description"
                                   id="tag_description"
                                   modelName="tag"
                                   modelId={this.props.tagId}
                                   placeholder={I18n.t('js.tag.common.placeholders.description')}
                                   onSubmit={this.props.handleSubmit}
                                   component={EditorField}
                                   componentContent={this.props.children.description}/>

                            <div className="row">
                                <div className="col s12 m6 center-align">
                                    <div className={this.props.classes.categoryTitle}>
                                        {I18n.t('js.tag.model.visibility')}
                                    </div>

                                    <Field name="visibility"
                                           id="tag_visibility"
                                           className={this.props.classes.select}
                                           label=""
                                           options={I18n.t('js.tag.enums.visibility')}
                                           component={SelectFormField}/>
                                </div>

                                <div className="col s12 m6">
                                    <div className={this.props.classes.categoryTitle}>
                                        {I18n.t('js.tag.model.synonyms')}
                                    </div>

                                    <Field name="synonyms"
                                           type="select-multi"
                                           component={AutocompleteFormField}
                                           label={I18n.t('js.tag.common.synonyms')}
                                           inputVariant="standard"
                                           isMultiple={true}
                                           isTagged={true}
                                           required={true}
                                           fullWidth={true}
                                           filterValues={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="margin-top-40 margin-bottom-20">
                    <div className="row">
                        <div className="col s6 center-align">
                            <Button color="default"
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={this.props.isEditing ? `/tags/${this.props.children.slug}` : '/'}>
                                {I18n.t('js.tag.edit.back_button')}
                            </Button>
                        </div>

                        <div className="col s6 center-align">
                            <Button color="primary"
                                    variant="outlined"
                                    size="small"
                                    disabled={this.props.submitting}
                                    onClick={this.props.handleSubmit}>
                                {
                                    this.props.isEditing
                                        ?
                                        I18n.t('js.tag.edit.submit')
                                        :
                                        I18n.t('js.tag.new.submit')
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
