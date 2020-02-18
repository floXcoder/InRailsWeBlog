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
    editInventoriesTopicPath,
    userTopicPath,
    rootPath
} from '../../../constants/routesHelper';

import {
    validateTopic
} from '../../../forms/topic';

import EditorField from '../../editor/form/editor';

import TextFormField from '../../material-ui/form/text';

import styles from '../../../../jss/topic/form';

export default @withStyles(styles)
class TopicFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        topic: PropTypes.number.isRequired,
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
        return I18n.t('js.topic.form.unsaved', {location: location.pathname});
    };

    render() {
        return (
            <Form initialValues={this.props.topic}
                  validate={validateTopic}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, dirty, submitting}) => (
                        <form id={this.props.id}
                              onSubmit={handleSubmit}>
                            <Prompt when={dirty}
                                    message={this._onUnsavedExit}/>

                            <div className="row">
                                {
                                    this.props.children.name &&
                                    <div className="col s12">
                                        <h1>
                                            {I18n.t('js.topic.edit.title', {topic: this.props.children.name})}
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
                                           id="topic_name"
                                           label={I18n.t('js.topic.common.placeholders.name')}
                                           autoFocus={true}
                                           required={true}
                                           color="primary"/>
                                </div>

                                <div className="col s12 margin-top-25">
                                    <Field name="description"
                                           component={EditorField}
                                           id="topic_description"
                                           modelName="topic"
                                           modelId={this.props.topic.id}
                                           placeholder={I18n.t('js.topic.common.placeholders.description')}
                                           onSubmit={handleSubmit}
                                           componentContent={this.props.children.description}/>
                                </div>

                                {
                                    this.props.topic.mode === 'inventories' &&
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
