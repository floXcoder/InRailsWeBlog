'use strict';

import {
    Link
} from 'react-router-dom';

import {
    fetchTag
} from '../../actions';

import {
    getIsOwner
} from '../../selectors';

import Form from '../materialize/form';
import Input from '../materialize/input';
import Textarea from '../materialize/textarea';
import Select from '../materialize/select';
import Selecter from '../theme/selecter';
import Submit from '../materialize/submit';

@connect((state, props) => ({
    tag: props.tagProps.tag,
    isOwner: getIsOwner(state, props.tagProps.tag && props.tagProps.tag.user.id),
    isConnected: state.userState.isConnected
}), {
    fetchTag
})
export default class TagEdit extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        tag: PropTypes.object,
        isOwner: PropTypes.bool,
        isConnected: PropTypes.bool,
        fetchTag: PropTypes.func
    };

    constructor(props) {
        super(props);

        props.fetchTag(props.params.tagSlug || props.params.tagId);
    }

    render() {
        if (!this.props.tag) {
            return null;
        }

        return (
            <div className="card">
                <Form id={`edit_tag_${this.props.tag.id}`}
                      className="blog-form"
                      action={`/tags/${this.props.tag.slug}`}>

                    <div className="card-content">
                        <h3 className="adaptative-title center-align">
                            {I18n.t('js.tag.edit.title', {name: this.props.tag.name})}
                        </h3>

                        <div className="row">
                            <div className="col s12 m6">
                                <Input id="tag_name"
                                       title={I18n.t('js.tag.model.name')}
                                       labelClass="important">
                                    {this.props.tag.name}
                                </Input>
                            </div>

                            {
                                (this.props.tag.visibility === 'everyone' || this.props.isOwner) &&
                                <div className="col s12 m6">
                                    <Textarea id="tag_description"
                                              title={I18n.t('js.tag.model.description')}
                                              labelClass="important">
                                        {this.props.tag.description}
                                    </Textarea>
                                </div>
                            }

                            <div className="col s12 m6">
                                <Select id="tag_visibility"
                                        title={I18n.t('js.tag.model.visibility')}
                                        default={I18n.t('js.tag.common.visibility')}
                                        options={I18n.t('js.tag.enums.visibility')}>
                                    {this.props.tag.visibility}
                                </Select>
                            </div>

                            <div className="col s12 m6">
                                <Selecter id="tag_synonyms"
                                           elements={[]}
                                           title={I18n.t('js.tag.model.synonyms')}
                                           placeholder={I18n.t('js.tag.common.synonyms')}
                                           isEditing={true}
                                           isHorizontal={true}>
                                    {this.props.tag.synonyms}
                                </Selecter>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link to={`/tag/${this.props.tag.slug}`}
                                      className="btn btn-default waves-effect waves-light">
                                    {I18n.t('js.tag.edit.back_button')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="profile-update">
                                    {I18n.t('js.tag.edit.update_label')}
                                </Submit>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}
