'use strict';

import Form from '../materialize/form';
import Modal from '../materialize/modal/modal';
import ModalFooter from '../materialize/modal/footer';
import Input from '../materialize/input';
import Select from '../materialize/select';
import Checkbox from '../materialize/checkbox';
import Submit from '../materialize/submit';

export default class Signup extends React.PureComponent {
    static propTypes = {
        launcherClass: PropTypes.string.isRequired,
        formId: PropTypes.string,
        modalId: PropTypes.string,
        url: PropTypes.string,
        validationUrl: PropTypes.string
    };

    static defaultProps = {
        formId: 'signup-user',
        modalId: 'signup-modal',
        url: '/users',
        validationUrl: '/users/validation'
    };

    constructor(props) {
        super(props);
    }

    _handleProClick = (event) => {
        event.preventDefault();

        if (this.state.isPro) {
            this.setState({
                isPro: 0
            });
        } else {
            this.setState({
                isPro: 1
            });
        }
    };

    _handleModalOpen = () => {
        return $("#user_pseudo").focus();
    };

    _handleCancelClick = () => {
        $('#' + this.props.modalId).modal('close');
    };

    render() {
        return (
            <Modal id={this.props.modalId}
                   launcherClass={this.props.launcherClass}
                   title={I18n.t('js.user.signup.title')}
                   onOpen={this._handleModalOpen}>

                <Form id={this.props.formId}
                      className="connection"
                      action={this.props.url}
                      isValidating={true}>

                    <div className="row connection-externals margin-bottom-0">
                        <div className="col s12 l6">
                            <div className="connection-google">
                                <a className="connection-google-button"
                                   href="/users/auth/google_oauth2">
                                    {I18n.t('js.user.signup.externals.google')}
                                </a>
                            </div>
                        </div>

                        <div className="col s12 l6">
                            <div className="connection-facebook">
                                <a className="connection-facebook-button"
                                   href="/users/auth/facebook">
                                    {I18n.t('js.user.signup.externals.facebook')}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="connection-or-separator hr-around-text">
                        {I18n.t('js.helpers.or')}
                    </div>

                    <div className="row margin-bottom-0">
                        <div className="col s12 l6">
                            <Input id="user_pseudo_signup"
                                   name="user[pseudo]"
                                   title={I18n.t('js.user.signup.pseudo')}
                                   labelClass="important"
                                   isRequired={true}
                                   validator={{
                                       'data-parsley-remote': this.props.validationUrl,
                                       'data-parsley-remote-reverse': true,
                                       'data-parsley-remote-message': I18n.t('js.user.errors.pseudo.already_taken'),
                                       'data-parsley-minlength': window.parameters.user_pseudo_min_length,
                                       'data-parsley-maxlength': window.parameters.user_pseudo_max_length,
                                       'data-parsley-minlength-message': I18n.t('js.user.errors.pseudo.size', {
                                           min: window.parameters.user_pseudo_min_length,
                                           max: window.parameters.user_pseudo_max_length
                                       })
                                   }}
                                   icon="account_circle"/>
                        </div>

                        <div className="col s12 l6">
                            <Input id="user_email_signup"
                                   name="user[email]"
                                   type="email"
                                   title={I18n.t('js.user.signup.email')}
                                   labelClass="important"
                                   isRequired={true}
                                   icon="mail"/>
                        </div>
                    </div>

                    <div className="row margin-bottom-0">
                        <div className="col s12 l6">
                            <Input id="user_password_signup"
                                   name="user[password]"
                                   type="password"
                                   title={I18n.t('js.user.signup.password')}
                                   labelClass="important"
                                   isRequired={true}
                                   validator={{
                                       'data-parsley-minlength': window.parameters.user_password_min_length,
                                       'data-parsley-maxlength': window.parameters.user_password_max_length,
                                       'data-parsley-minlength-message': I18n.t('js.user.errors.password.size', {
                                           min: window.parameters.user_pseudo_min_length,
                                           max: window.parameters.user_pseudo_max_length
                                       })
                                   }}
                                   icon="lock"/>
                        </div>

                        <div className="col s12 l6">
                            <Input id="user_password_confirmation_signup"
                                   name="user[password_confirmation]"
                                   type="password"
                                   title={I18n.t('js.user.signup.confirm_password')}
                                   labelClass="important"
                                   isRequired={true}
                                   validator={{
                                       'data-parsley-equalto': '#user_password_signup',
                                       'data-parsley-equalto-message': I18n.t('js.user.errors.password.mismatch')
                                   }}
                                   icon="lock"/>
                        </div>
                    </div>

                    <div className="connection-checkbox margin-bottom-20">
                        <Checkbox id="user_terms_signup"
                                  name="user[terms]"
                                  title={
                                      <span>
                                      {I18n.t('js.user.signup.terms_of_use', {website: window.parameters.website_name}) + ' '}
                                          <a href="/terms">
                                        {I18n.t('js.user.signup.terms_of_use_name')}
                                      </a>
                                  </span>
                                  }
                                  isRequired={true}
                                  validator={{'data-parsley-error-message': I18n.t('js.user.errors.policy')}}/>
                    </div>

                    <ModalFooter>
                        <div className="left">
                            <a className="waves-effect waves-spectra btn-flat"
                               href="#"
                               onClick={this._handleCancelClick}>
                                {I18n.t('js.user.signup.cancel')}
                            </a>
                        </div>

                        <div className="right">
                            <Submit id="signup-submit">
                                {I18n.t('js.user.signup.submit')}
                            </Submit>
                        </div>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

