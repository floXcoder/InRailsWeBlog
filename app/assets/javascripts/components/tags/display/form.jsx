'use strict';

import {
    Prompt,
    Link
} from 'react-router-dom';

import {
    Form,
    Field
} from 'react-final-form';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {
    validateTag
} from '../../../forms/tag';

import EditorField from '../../editor/form/editor';

import TextFormField from '../../material-ui/form/text';
import SelectFormField from '../../material-ui/form/select';
import AutocompleteFormField from '../../material-ui/form/autocomplete';

import styles from '../../../../jss/tag/form';

export default @withStyles(styles)
class TagFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        tag: PropTypes.number.isRequired,
        onSubmit: PropTypes.func.isRequired,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
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
            <Form initialValues={this.props.tag}
                  validate={validateTag}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, dirty, submitting}) => (
                        <form id={this.props.id}
                              onSubmit={handleSubmit}>
                            <Prompt when={dirty}
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
                                               component={EditorField}
                                               id="tag_description"
                                               modelName="tag"
                                               modelId={this.props.tag.id}
                                               placeholder={I18n.t('js.tag.common.placeholders.description')}
                                               onSubmit={handleSubmit}
                                               componentContent={this.props.children.description}/>

                                        <div className="row">
                                            <div className="col s12 m6 center-align">
                                                <div className={this.props.classes.categoryTitle}>
                                                    {I18n.t('js.tag.model.visibility')}
                                                </div>

                                                <Field name="visibility"
                                                       component={SelectFormField}
                                                       id="tag_visibility"
                                                       className={this.props.classes.select}
                                                       label=""
                                                       options={I18n.t('js.tag.enums.visibility')}/>
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
                                                disabled={submitting}
                                                onClick={handleSubmit}>
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
                    )
                }
            </Form>
        );
    }
}
