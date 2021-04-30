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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {
    editInventoriesTopicPath,
    userTopicPath,
    rootPath
} from '../../../constants/routesHelper';

import {
    validateTopic
} from '../../../forms/topic';

import EditorField from '../../editor/form/editor';

import TextFormField from '../../material-ui/form/text';
import MultipleSelectFormField from '../../material-ui/form/multiple-select';

import styles from '../../../../jss/topic/form';

function TabContainer({isActive, children}) {
    return (
        <Typography component="div"
                    className={isActive ? null : 'hide'}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
};

export default @withStyles(styles)
class TopicFormDisplay extends React.Component {
    static propTypes = {
        topic: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        isEditing: PropTypes.bool,
        articleMultilanguage: PropTypes.bool,
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

    state = {
        tabStep: 0
    };

    _handleTabChange = (event, value) => {
        this.setState({tabStep: value});
    };

    _onUnsavedExit = (location) => {
        return I18n.t('js.topic.form.unsaved', {location: location.pathname});
    };

    _renderDescription = (handleSubmit, locale = undefined) => {
        const fieldName = locale ? `description_translations[${locale}]` : 'description';

        return (
            <Field name={fieldName}
                   component={EditorField}
                   id={`topic_description_${locale}`}
                   modelName="topic"
                   modelId={this.props.children.id}
                   placeholder={I18n.t('js.topic.common.placeholders.description')}
                   otherStaticBar="#header-user"
                   noHelper={true}
                   onSubmit={handleSubmit}/>
        );
    };

    render() {
        let localeOptions = {};
        window.locales.map((locale) => localeOptions[locale] = I18n.t(`js.languages.${locale}`));

        return (
            <Form initialValues={this.props.topic}
                  validate={validateTopic}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, dirty, submitting, values}) => (
                        <form id={`topic-form-${this.props.children.id || 'new'}`}
                              onSubmit={handleSubmit}>
                            <Prompt when={dirty && !submitting}
                                    message={this._onUnsavedExit}/>

                            <div className="row">
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
                                           id="topic_name"
                                           label={I18n.t('js.topic.common.placeholders.name')}
                                           autoFocus={true}
                                           required={true}
                                           color="primary"/>
                                </div>

                                <div className="col s12 margin-top-25">
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
                                                        values.languages.map((locale) => (
                                                            <Tab key={locale}
                                                                 label={I18n.t(`js.languages.${locale}`)}/>
                                                        ))
                                                    }
                                                </Tabs>

                                                {
                                                    values.languages.map((locale, i) => (
                                                        <TabContainer key={locale}
                                                                      isActive={this.state.tabStep === i}>
                                                            {this._renderDescription(handleSubmit, locale)}
                                                        </TabContainer>
                                                    ))
                                                }
                                            </>
                                            :
                                            this._renderDescription(handleSubmit)
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
                                    this.props.articleMultilanguage &&
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
                                <div className="row">
                                    <div className="col s6 center-align">
                                        <Button color="default"
                                                variant="text"
                                                size="small"
                                                component={Link}
                                                to={this.props.isEditing ? userTopicPath(this.props.children.user.slug, this.props.children.slug) : rootPath()}>
                                            {I18n.t('js.topic.edit.back_button')}
                                        </Button>
                                    </div>

                                    <div className="col s6 center-align">
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
                                </div>
                            </div>
                        </form>
                    )
                }
            </Form>
        );
    }
}
