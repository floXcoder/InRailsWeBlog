'use strict';

import _ from 'lodash';

// import UserActions from '../../actions/userActions';
// import UserStore from '../../stores/userStore';

import Form from '../materialize/form';
import Input from '../materialize/input';
import Textarea from '../materialize/textarea';
import Checkbox from '../materialize/checkbox';
import File from '../materialize/file';
import Submit from '../materialize/submit';

export default class UserEdit extends React.Component {
    static propTypes = {
        userId: PropTypes.string,
        params: PropTypes.object
    };

    static defaultProps = {
        params: {}
    };

    constructor(props) {
        super(props);

        // TODO
        // this.mapStoreToState(UserStore, this.onUserChange);
    }

    state = {
        user: {}
    };

    componentWillMount() {
        // TODO
        // UserActions.loadUser({
        //     userId: this.props.userId || this.props.params.userId,
        //     completeUser: true
        // });
    }

    onUserChange(userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (userData.type === 'loadUser') {
            newState.user = userData.user;
            newState.userTracker = _.omit(userData.user.tracker, 'comments_count');
            newState.userTracker.sign_in_count = userData.user.sign_in_count;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    render() {
        if ($.isEmpty(this.state.user)) {
            return null;
        }

        return (
            <div className="card">
                <Form id={`edit_user_${this.state.user.id}`}
                      className="blog-form"
                      action={`/users/${this.state.user.slug}`}
                      isMultipart={true}>

                    <div className="card-content">
                        <h3 className="adaptative-title center-align">
                            {I18n.t('js.user.edit.title')}
                        </h3>

                        <h4>
                            {I18n.t('js.user.edit.login_header')}
                        </h4>

                        <div className="row">
                            <div className="col s12 m6">
                                <Input id="user_pseudo"
                                       title={I18n.t('js.user.model.pseudo')}
                                       labelClass="important"
                                       isDisabled={true}
                                       icon="account_circle">
                                    {this.state.user.pseudo}
                                </Input>
                            </div>

                            <div className="col s12 m6">
                                <Input id="user_email"
                                       title={I18n.t('js.user.model.email')}
                                       labelClass="important"
                                       isDisabled={true}
                                       icon="mail">
                                    {this.state.user.email}
                                </Input>
                            </div>

                            <div className="col s12 center-align">
                                <a href="/users/edit">
                                    {I18n.t('js.user.edit.connection_parameters')}
                                </a>
                            </div>
                        </div>

                        <h4 className="margin-top-30">
                            {I18n.t('js.user.edit.profile_picture')}
                        </h4>

                        <div className="row">
                            <div className="col s12">
                                {
                                    this.state.user.avatar
                                        ?
                                        <div>
                                            <p className="margin-bottom-10">
                                                {I18n.t('js.user.edit.current_picture')}
                                            </p>
                                            <img src={this.state.user.avatar}
                                                 alt="User avatar"/>
                                            <p className="margin-bottom-20">
                                                <Checkbox id="user_picture_attributes__destroy"
                                                          name="user[picture_attributes][_destroy]"
                                                          title={I18n.t('js.user.edit.remove_picture')}>
                                                    {false}
                                                </Checkbox>
                                            </p>

                                            <p>
                                                {I18n.t('js.user.edit.replace_picture')}
                                            </p>
                                        </div>
                                        :
                                        <p>
                                            {I18n.t('js.user.edit.no_picture')}
                                        </p>
                                }
                            </div>

                            <div className="col s12 m5">
                                <File id="user_picture_attributes_image"
                                      name="user[picture_attributes][image]"
                                      buttonName={I18n.t('js.user.edit.local_picture')}
                                      placeholder={I18n.t('js.user.edit.placeholder_picture')}/>
                            </div>

                            <div className="col s12 m1 center-align">
                                <span>
                                    {I18n.t('js.user.edit.or')}
                                </span>
                            </div>

                            <div className="col s12 m6">
                                <Input id="user_picture_attributes_remote_image_url"
                                       name="user[picture_attributes][remote_image_url]"
                                       title={I18n.t('js.user.edit.remote_picture')}
                                       icon="photo"/>
                            </div>
                        </div>

                        <h4 className="margin-top-30">
                            {I18n.t('js.user.edit.personal_information_header')}
                        </h4>

                        <div className="row">
                            <div className="col s12 m6">
                                <Input id="user_first_name"
                                       title={I18n.t('js.user.model.first_name')}
                                       labelClass="important"
                                       icon="account_circle">
                                    {this.state.user.first_name}
                                </Input>
                            </div>

                            <div className="col s12 m6">
                                <Input id="user_last_name"
                                       title={I18n.t('js.user.model.last_name')}
                                       labelClass="important"
                                       icon="account_circle">
                                    {this.state.user.last_name}
                                </Input>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col s12">
                                <Textarea id="user_additional_info"
                                          title={I18n.t('js.user.model.additional_info')}>
                                    {this.state.user.additional_info}
                                </Textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link to={'/'}
                                      className="btn btn-default">
                                    {I18n.t('js.user.edit.back_button')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="profile-update">
                                    {I18n.t('js.user.edit.update_profile')}
                                </Submit>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}
