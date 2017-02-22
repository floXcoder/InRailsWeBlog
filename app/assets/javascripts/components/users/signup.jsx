'use strict';

const Form = require('../materialize/form');
const Modal = require('../materialize/modal/modal');
const ModalFooter = require('../materialize/modal/footer');
const Input = require('../materialize/input');
const Checkbox = require('../materialize/checkbox');
const Submit = require('../materialize/submit');

var Signup = React.createClass({
    propTypes: {
        launcherClass: React.PropTypes.string,
        formId: React.PropTypes.string,
        modalId: React.PropTypes.string,
        url: React.PropTypes.string,
        validationUrl: React.PropTypes.string,
        isOpened: React.PropTypes.bool
    },

    getDefaultProps () {
        return {
            formId: 'signup-user',
            modalId: 'signup-modal',
            url: '/users',
            validationUrl: '/users/validation',
            isOpened: false
        };
    },

    componentDidMount () {
        if (this.props.isOpened) {
            $('#' + this.props.modalId).openModal();
        }
    },

    componentDidUpdate () {
        if (this.props.isOpened) {
            $('#' + this.props.modalId).openModal();
        }
    },

    _handleModalOpen () {
        return $('#signup-user-pseudo').focus();
    },

    _handleCancelClick () {
        $('#' + this.props.modalId).closeModal();
    },

    render () {
        return (
            <Modal id={this.props.modalId}
                   launcherClass={this.props.launcherClass}
                   title={I18n.t('js.user.signup.title')}
                   onOpen={this._handleModalOpen}>

                <Form ref="signupForm"
                      id={this.props.formId}
                      action={this.props.url}
                      isValidating={true}>

                    <div className="section">
                        <Input ref="userPseudo"
                               id="signup-user-pseudo"
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

                    <div className="section">
                        <Input ref="userEmail"
                               id="signup-user-email"
                               name="user[email]"
                               type="email"
                               title={I18n.t('js.user.signup.email')}
                               labelClass="important"
                               isRequired={true}
                               icon="mail"/>
                    </div>

                    <div className="section">
                        <Input ref="userPassword"
                               id="signup-user-password"
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

                    <div className="section">
                        <Input ref="userPasswordConfirmation"
                               id="signup-user-password-confirmation"
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

                    <div className="section">
                        <Checkbox ref="userTerms"
                                  id="signup-user-terms"
                                  name="user[terms]"
                                  title={
                                      <span>
                                      {I18n.t('js.user.signup.terms_of_use', {website: window.parameters.website_name}) + ' '}
                                          <a href="/terms_of_use">
                                        {I18n.t('js.user.signup.terms_of_use_name')}
                                      </a>
                                  </span>
                                  }
                                  isRequired={true}
                                  validator={{'data-parsley-error-message': I18n.t('js.user.errors.policy')}}/>
                    </div>

                    <ModalFooter>
                        <div className="left">
                            <a className="waves-effect waves-teal btn-flat"
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
});

module.exports = Signup;
