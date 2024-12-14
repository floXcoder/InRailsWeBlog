import React from 'react';
import PropTypes from 'prop-types';

import {
    Link,
    // Prompt,
} from 'react-router';

import {
    Form,
    Field
} from 'react-final-form';

import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import I18n from '@js/modules/translations';

import {
    editInventoriesTopicPath,
    userTopicPath,
    rootPath
} from '@js/constants/routesHelper';

import {
    validateTopic
} from '@js/forms/topic';

import EditorField from '@js/components/editor/form/editor';

import TabContainer from '@js/components/material-ui/tabContainer';
import TextFormField from '@js/components/material-ui/form/text';
import MultipleSelectFormField from '@js/components/material-ui/form/multiple-select';


export default class TopicFormDisplay extends React.Component {
    static propTypes = {
        topic: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        isEditing: PropTypes.bool,
        articleMultilanguage: PropTypes.bool,
        children: PropTypes.object
    };

    static defaultProps = {
        isEditing: false,
        children: {}
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
    //     return I18n.t('js.topic.form.unsaved', {location: location.pathname});
    // };

    _renderDescriptionField = (handleSubmit, locale = undefined) => {
        const fieldName = locale ? `description_translations[${locale}]` : 'description';

        return (
            <Field name={fieldName}
                   component={EditorField}
                   id={`topic_description_${locale ? '_' + locale : ''}`}
                   modelName="topic"
                   modelId={this.props.children.id}
                   placeholder={I18n.t('js.topic.common.placeholders.description')}
                   otherStaticBar="#header-user"
                   noHelper={true}
                   onSubmit={handleSubmit}/>
        );
    };

    render() {
        const localeOptions = {};
        window.locales.map((locale) => localeOptions[locale] = I18n.t(`js.languages.${locale}`));

        const topicValues = {
            name: this.props.topic?.name,
            description: this.props.topic?.description,
            description_translations: this.props.topic?.descriptionTranslations,
            languages: this.props.topic?.languages
        };

        return (
            <Form initialValues={topicValues}
                  validate={validateTopic}
                  onSubmit={this.props.onSubmit}>
                {
                    ({
                         handleSubmit,
                         dirty,
                         submitting,
                         values
                     }) => (
                        <form id={`topic-form-${this.props.children.id || 'new'}`}
                              onSubmit={handleSubmit}>
                            {/*<Prompt when={dirty && !submitting}*/}
                            {/*        message={this._onUnsavedExit}/>*/}

                            <div className="row">
                                <div className="col s12 margin-bottom-30">
                                    <Field name="name"
                                           component={TextFormField}
                                           className="topic-form-name"
                                           slotProps={{
                                               input: {
                                                   classes: {
                                                       underline: !this.props.children.name && 'topic-form-nameUnderline'
                                                   }
                                               },
                                               inputLabel: {
                                                   classes: {
                                                       root: 'topic-form-nameLabel'
                                                   }
                                               }
                                           }}
                                           id="topic_name"
                                           label={I18n.t('js.topic.common.placeholders.name')}
                                           autoFocus={true}
                                           required={true}
                                           color="primary"/>
                                </div>

                                <div className="col s12 margin-bottom-30">
                                    {
                                        values.languages?.length > 1
                                            ?
                                            <>
                                                <Tabs value={this.state.tabStep}
                                                      indicatorColor="primary"
                                                      textColor="primary"
                                                      centered={true}
                                                      onChange={this._handleTabChange}>
                                                    {
                                                        values.languages.map((locale, i) => (
                                                            <Tab key={locale}
                                                                 index={i}
                                                                 label={I18n.t(`js.languages.${locale}`)}/>
                                                        ))
                                                    }
                                                </Tabs>

                                                {
                                                    values.languages.map((locale, i) => (
                                                        <TabContainer key={locale}
                                                                      isActive={this.state.tabStep === i}>
                                                            {this._renderDescriptionField(handleSubmit, locale)}
                                                        </TabContainer>
                                                    ))
                                                }
                                            </>
                                            :
                                            this._renderDescriptionField(handleSubmit)
                                    }
                                </div>

                                {
                                    this.props.children.mode === 'inventories' &&
                                    <div className="col s12 center-align margin-top-35">
                                        <Button color="primary"
                                                variant="outlined"
                                                size="small"
                                                component={Link}
                                                to={editInventoriesTopicPath(this.props.children.user.slug, this.props.children.slug)}>
                                            {I18n.t('js.topic.edit.update_inventories')}
                                        </Button>
                                    </div>
                                }

                                {
                                    !!this.props.articleMultilanguage &&
                                    <div className="col s12 margin-top-25">
                                        <Field name="languages"
                                               component={MultipleSelectFormField}
                                               id="topic_languages"
                                               multiple={true}
                                               label={I18n.t('js.topic.model.languages')}
                                               options={localeOptions}/>
                                    </div>
                                }
                            </div>

                            <div className="margin-top-50 margin-bottom-20">
                                <div className="row center-align">
                                    <div className="col s12 margin-bottom-40">
                                        <Button color="primary"
                                                variant="contained"
                                                size="small"
                                                disabled={submitting}
                                                onClick={handleSubmit}>
                                            {
                                                this.props.isEditing
                                                    ?
                                                    I18n.t('js.topic.edit.submit')
                                                    :
                                                    I18n.t('js.topic.new.submit')
                                            }
                                        </Button>
                                    </div>

                                    <div className="col s12">
                                        <Button
                                            variant="text"
                                            size="small"
                                            component={Link}
                                            to={this.props.isEditing ? userTopicPath(this.props.children.user.slug, this.props.children.slug) : rootPath()}>
                                            {I18n.t('js.topic.edit.back_button')}
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
