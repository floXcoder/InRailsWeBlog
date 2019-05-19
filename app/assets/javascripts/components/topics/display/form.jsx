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
    validateTopic
} from '../../../forms/topic';

import TopicErrorField from './fields/error';

import SelecterField from '../../theme/form/selecter';
import EditorField from '../../editor/form/editor';

import TextFieldForm from '../../material-ui/form/text';
import SelectFieldForm from '../../material-ui/form/select';

import styles from '../../../../jss/topic/form';

export default @reduxForm({
    form: 'topic',
    validateTopic,
    enableReinitialize: true,
})
@withStyles(styles)
class TopicFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        topicId: PropTypes.number.isRequired,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        topicErrors: PropTypes.array,
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
        return I18n.t('js.topic.form.unsaved', {location: location.pathname});
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
                            this.props.topicErrors &&
                            <div className="col s12">
                                <TopicErrorField errors={this.props.topicErrors}/>
                            </div>
                        }

                        <div className="col s12">
                            <Field name="name"
                                   component={TextFieldForm}
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

                        <div className="col s12">
                            <div className={this.props.classes.categoryTitle}>
                                {I18n.t('js.topic.model.description')}
                            </div>
                            <Field name="description"
                                   id="topic_description"
                                   modelName="topic"
                                   modelId={this.props.topicId}
                                   placeholder={I18n.t('js.topic.common.placeholders.description')}
                                   onSubmit={this.props.handleSubmit}
                                   component={EditorField}
                                   componentContent={this.props.children.description}/>
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
                                    to={this.props.isEditing ? `/users/${this.props.children.user.slug}/topics/${this.props.children.slug}/show` : '/'}>
                                {I18n.t('js.topic.edit.back_button')}
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
                                        I18n.t('js.topic.edit.submit')
                                        :
                                        I18n.t('js.topic.new.submit')
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
