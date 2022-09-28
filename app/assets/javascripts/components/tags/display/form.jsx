'use strict';

import {
    Link
    // Prompt,
} from 'react-router-dom';

import {
    Form,
    Field
} from 'react-final-form';

import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import {
    showTagPath
} from '../../../constants/routesHelper';

import {
    validateTag
} from '../../../forms/tag';

import EditorField from '../../editor/form/editor';

import TabContainer from '../../material-ui/tabContainer';
import TextFormField from '../../material-ui/form/text';
import SelectFormField from '../../material-ui/form/select';
import AutocompleteFormField from '../../material-ui/form/autocomplete';


export default class TagFormDisplay extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        children: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        tabStep: 0
    };

    _handleTabChange = (event, value) => {
        this.setState({tabStep: value});
    };

    // _onUnsavedExit = (location) => {
    //     return I18n.t('js.tag.form.unsaved', {location: location.pathname});
    // };

    _renderDescriptionField = (handleSubmit, locale) => {
        const fieldName = locale ? `description_translations[${locale}]` : 'description';

        return (
            <div className="col s12">
                <Field name={fieldName}
                       component={EditorField}
                       id={`tag_description${locale ? '_' + locale : ''}`}
                       modelName="tag"
                       modelId={this.props.children.id}
                       placeholder={I18n.t('js.tag.common.placeholders.description')}
                       otherStaticBar="#header-user"
                       onSubmit={handleSubmit}
                       componentContent={this.props.children.descriptionTranslations[locale] || this.props.children.description}/>
            </div>
        );
    };

    render() {
        const tagValues = {
            name: this.props.children?.name,
            description: this.props.children?.description,
            description_translations: this.props.children?.descriptionTranslations,
            visibility: this.props.children?.visibility,
            synonyms: this.props.children?.synonyms
        };

        return (
            <Form initialValues={tagValues}
                  validate={validateTag}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, dirty, submitting}) => (
                        <form id={`tag-form-${this.props.children.id || 'new'}`}
                              onSubmit={handleSubmit}>
                            {/*<Prompt when={dirty && !submitting}*/}
                            {/*        message={this._onUnsavedExit}/>*/}

                            <div>
                                <div className="row">
                                    {
                                        !!this.props.children.name &&
                                        <div className="col s12">
                                            <h1>
                                                {I18n.t('js.tag.edit.title', {tag: this.props.children.name})}
                                            </h1>
                                        </div>
                                    }

                                    <div className="col s12">
                                        <Field name="name"
                                               component={TextFormField}
                                               className="tag-form-name"
                                               InputLabelProps={{
                                                   classes: {
                                                       root: 'tag-form-nameLabel'
                                                   }
                                               }}
                                               InputProps={{
                                                   classes: {
                                                       underline: !this.props.children.name && 'tag-form-nameUnderline'
                                                   }
                                               }}
                                               id="tag_name"
                                               label={I18n.t('js.tag.common.placeholders.name')}
                                               autoFocus={true}
                                               required={true}
                                               variant="standard"
                                               color="primary"
                                               disabled={this.props.children.visibility === 'everyone'}/>

                                        {
                                            this.props.children.visibility === 'everyone' &&
                                            <p className="tag-form-name-advice">
                                                {I18n.t('js.tag.common.visibility_immutable')}
                                            </p>
                                        }
                                    </div>

                                    <div className="col s12 margin-top-30 margin-bottom-30">
                                        <div className="tag-form-category-title">
                                            {I18n.t('js.tag.model.description')}
                                        </div>

                                        <Tabs value={this.state.tabStep}
                                              indicatorColor="primary"
                                              textColor="primary"
                                              centered={true}
                                              onChange={this._handleTabChange}>
                                            {
                                                window.locales.map((locale) => (
                                                    <Tab key={locale}
                                                         label={I18n.t(`js.languages.${locale}`)}/>
                                                ))
                                            }
                                        </Tabs>

                                        {
                                            window.locales.map((locale, i) => (
                                                <TabContainer key={locale}
                                                              isActive={this.state.tabStep === i}>
                                                    {this._renderDescriptionField(handleSubmit, locale)}
                                                </TabContainer>
                                            ))
                                        }
                                    </div>

                                    <div className="col s12 m6 center-align">
                                        <div className="tag-form-category-title">
                                            {I18n.t('js.tag.model.visibility')}
                                        </div>

                                        <Field name="visibility"
                                               component={SelectFormField}
                                               id="tag_visibility"
                                               className="tag-form-select"
                                               label=""
                                               variant="standard"
                                               disabled={this.props.children.visibility === 'everyone'}
                                               options={I18n.t('js.tag.enums.visibility')}/>
                                    </div>

                                    <div className="col s12 m6">
                                        <div className="tag-form-category-title">
                                            {I18n.t('js.tag.model.synonyms')}
                                        </div>

                                        <Field name="synonyms"
                                               type="select-multi"
                                               component={AutocompleteFormField}
                                               label={I18n.t('js.tag.common.synonyms')}
                                               inputVariant="standard"
                                               isMultiple={true}
                                               isSimpleArray={true}
                                               isTagged={true}
                                               fullWidth={true}
                                               hasFilterValues={true}/>
                                    </div>
                                </div>
                            </div>

                            <div className="margin-top-50 margin-bottom-20">
                                <div className="row center-align">
                                    <div className="col s12 margin-bottom-40">
                                        <Button color="primary"
                                                variant="outlined"
                                                size="small"
                                                disabled={submitting}
                                                onClick={handleSubmit}>
                                            {I18n.t('js.tag.edit.submit')}
                                        </Button>
                                    </div>

                                    <div className="col s12">
                                        <Button
                                            variant="text"
                                            size="small"
                                            component={Link}
                                            to={showTagPath(this.props.children.slug)}>
                                            {I18n.t('js.tag.edit.back_button')}
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
