'use strict';

// TODO
// import TagActions from '../../actions/tagActions';
// import TagStore from '../../stores/tagStore';

import Form from '../materialize/form';
import Input from '../materialize/input';
import Textarea from '../materialize/textarea';
import Select from '../materialize/select';
import Selecter from '../theme/selecter';
import Submit from '../materialize/submit';

import {Link} from 'react-router-dom';

export default class TagEdit extends React.Component {
    static propTypes = {
        tagId: PropTypes.object,
        params: PropTypes.object
    };

    static defaultProps = {
        tagId: null,
        params: {}
    };

    constructor(props) {
        super(props);

        // TODO
        // this.mapStoreToState(TagStore, this.onTagChange);
    }

    state = {
        tag: {}
    };

    componentWillMount() {
        // TODO
        // TagActions.loadTag({
        //     id: this.props.tagId || this.props.params.tagId
        // });
    }

    onTagChange(tagData) {
        if ($.isEmpty(tagData)) {
            return;
        }

        let newState = {};

        if (tagData.type === 'loadTag') {
            newState.tag = tagData.tag;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    render() {
        if ($.isEmpty(this.state.tag)) {
            return null;
        }

        return (
            <div className="card">
                <Form id={`edit_tag_${this.state.tag.id}`}
                      className="blog-form"
                      action={`/tags/${this.state.tag.slug}`}>

                    <div className="card-content">
                        <h3 className="adaptative-title center-align">
                            {I18n.t('js.tag.edit.title', {name: this.state.tag.name})}
                        </h3>

                        <div className="row">
                            <div className="col s12 m6">
                                <Input id="tag_name"
                                       title={I18n.t('js.tag.model.name')}
                                       labelClass="important">
                                    {this.state.tag.name}
                                </Input>
                            </div>

                            {
                                (this.state.tag.visibility === 'everyone' || this.state.tag.id === $app.user.currentId) &&
                                <div className="col s12 m6">
                                    <Textarea id="tag_description"
                                              title={I18n.t('js.tag.model.description')}
                                              labelClass="important">
                                        {this.state.tag.description}
                                    </Textarea>
                                </div>
                            }

                            <div className="col s12 m6">
                                <Select id="tag_visibility"
                                        title={I18n.t('js.tag.model.visibility')}
                                        default={I18n.t('js.tag.common.visibility')}
                                        options={I18n.t('js.tag.enums.visibility')}>
                                    {this.state.tag.visibility}
                                </Select>
                            </div>

                            <div className="col s12 m6">
                                <Selecter id="tag_synonyms"
                                           elements={[]}
                                           title={I18n.t('js.tag.model.synonyms')}
                                           placeholder={I18n.t('js.tag.common.synonyms')}
                                           isEditing={true}
                                           isHorizontal={true}>
                                    {this.state.tag.synonyms}
                                </Selecter>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link to={`/tag/${this.state.tag.slug}`}
                                      className="btn btn-default">
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
