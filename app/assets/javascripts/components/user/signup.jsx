'use strict';

var validator = require('validator');

var Modal = require('../materialize/modal/modal');
var ModalFooter = require('../materialize/modal/footer');
var Input = require('../materialize/input');
var Checkbox = require('../materialize/checkbox');
var Submit = require('../materialize/submit');

var UserStore = require('../../stores/userStore');
var UserActions = require('../../actions/userActions');

var Signup = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onUserValidation')
    ],

    propTypes: {
        buttonId: React.PropTypes.string.isRequired,
        formId: React.PropTypes.string,
        modalId: React.PropTypes.string,
        url: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            formId: 'signup-user',
            modalId: 'signup-modal',
            url: '/signup'
        };
    },

    _handleModalOpen () {
        return $("#user_pseudo").focus();
    },

    _handleCancelClick () {
        $('#' + this.props.modalId).closeModal();
    },

    _handleInputBlur () {
        let serializedForm = $('#' + this.props.formId)
            .find("input[value!='']")
            .filter(function () {
                return !!this.value && this.type.indexOf('password') === -1;
            }).serialize();

        if (!$.isEmpty(serializedForm)) {
            UserActions.validation(serializedForm);
        }
    },

    _handleSubmitClick (event) {
        if(this.onUserValidation({})) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    },

    _handleCheckboxChange () {
        let checkBoxState = this.refs.userTerms.toggleCheckbox();
        this.onUserValidation({checkbox: checkBoxState});
    },

    onUserValidation (userValidation) {
        let isValid = true;

        if (!validator.isLength(this.refs.userPseudo.value(),
                window.parameters.user_pseudo_min_length,
                window.parameters.user_pseudo_max_length)) {
            isValid = false;
            this.refs.userPseudo.setInvalid(I18n.t('js.user.errors.pseudo.size',
                {
                    min: window.parameters.user_pseudo_min_length,
                    max: window.parameters.user_pseudo_max_length
                }));
        } else if (!$.isEmpty(userValidation.user) && userValidation.user.pseudo) {
            isValid = false;
            this.refs.userPseudo.setInvalid(I18n.t('js.user.errors.pseudo.already_taken'));
        } else {
            this.refs.userPseudo.setValid('\u2714');
        }

        if (!validator.isEmail(this.refs.userEmail.value())) {
            isValid = false;
            this.refs.userEmail.setInvalid(I18n.t('js.user.errors.email.invalid'));
        } else if (!$.isEmpty(userValidation.user) && userValidation.user.email) {
            isValid = false;
            this.refs.userEmail.setInvalid(I18n.t('js.user.errors.email.already_taken'));
        } else {
            this.refs.userEmail.setValid('\u2714');
        }

        if (!$.isEmpty(this.refs.userPassword.value()) && !validator.isLength(this.refs.userPassword.value(),
                window.parameters.user_password_min_length,
                window.parameters.user_password_max_length)) {
            isValid = false;
            this.refs.userPassword.setInvalid(I18n.t('js.user.errors.password.size',
                {
                    min: window.parameters.user_password_min_length,
                    max: window.parameters.user_password_max_length
                }));
        } else if (this.refs.userPassword.value() !== this.refs.userPasswordConfirmation.value()) {
            isValid = false;
            this.refs.userPassword.setInvalid(I18n.t('js.user.errors.password.mismatch'));
            if (!$.isEmpty(this.refs.userPasswordConfirmation.value())) {
                this.refs.userPasswordConfirmation.setInvalid(I18n.t('js.user.errors.password.mismatch'));
            }
        } else {
            if (!$.isEmpty(this.refs.userPassword.value()) && !$.isEmpty(this.refs.userPasswordConfirmation.value())) {
                this.refs.userPassword.setValid('\u2714');
                this.refs.userPasswordConfirmation.setValid('\u2714');
            } else {
                this.refs.userPassword.reset();
                this.refs.userPasswordConfirmation.reset();
            }
        }

        if ((typeof(userValidation.checkbox) !== 'undefined' && !userValidation.checkbox) ||
            (typeof(userValidation.checkbox) === 'undefined' && !this.refs.userTerms.isChecked())) {
            isValid = false;
            this.refs.userTerms.setInvalid();
        } else {
            this.refs.userTerms.setValid();
        }

        if (!isValid) {
            this.refs.submitSignup.disabledSubmit();
        } else {
            this.refs.submitSignup.enabledSubmit();
        }

        return isValid;
    },

    render () {
        return (
            <Modal id={this.props.modalId}
                   buttonId={this.props.buttonId}
                   title={I18n.t('js.user.signup.title')}
                   onOpen={this._handleModalOpen}>

                <form id={this.props.formId}
                      method="post"
                      action={this.props.url}
                      className="ap-modal-form"
                      data-remote="true"
                      acceptCharset="UTF-8"
                      noValidate="novalidate">

                    <div className="section">
                        <Input ref="userPseudo"
                               id="user_pseudo"
                               classType="important"
                               onBlur={this._handleInputBlur}
                               icon="account_circle">
                            {I18n.t('js.user.signup.pseudo')}
                        </Input>
                    </div>

                    <div className="section">
                        <Input ref="userEmail"
                               id="user_email"
                               classType="important"
                               onBlur={this._handleInputBlur}
                               icon="mail">
                            {I18n.t('js.user.signup.email')}
                        </Input>
                    </div>

                    <div className="section">
                        <Input ref="userPassword"
                               id="user_password"
                               type="password"
                               classType="important"
                               onBlur={this._handleInputBlur}
                               minLength={window.parameters.user_password_min_length}
                               maxLength={window.parameters.user_password_max_length}
                               icon="lock">
                            {I18n.t('js.user.signup.password')}
                        </Input>
                    </div>

                    <div className="section">
                        <Input ref="userPasswordConfirmation"
                               id="user_password_confirmation"
                               type="password"
                               classType="important"
                               onBlur={this._handleInputBlur}
                               minLength={window.parameters.user_password_min_length}
                               maxLength={window.parameters.user_password_max_length}
                               icon="lock">
                            {I18n.t('js.user.signup.confirm_password')}
                        </Input>
                    </div>

                    <div className="section">
                        <Checkbox ref="userTerms" id="user_terms"
                                  onCheckboxChange={this._handleCheckboxChange}>
                            {I18n.t('js.user.signup.terms_of_use') + ' '}
                            <a href="/terms_of_use">{I18n.t('js.user.signup.terms_of_use_name')}</a>
                        </Checkbox>
                    </div>

                    <ModalFooter>
                        <a href="#"
                           onClick={this._handleCancelClick}>
                            {I18n.t('js.user.signup.cancel')}
                        </a>
                        <Submit ref="submitSignup" id="login-submit"
                                onClick={this._handleSubmitClick}>
                            {I18n.t('js.user.signup.submit')}
                        </Submit>
                    </ModalFooter>

                </form>

            </Modal>
        );
    }
});

module.exports = Signup;
