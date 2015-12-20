'use strict';

var Modal = require('../materialize/modal/modal');
var ModalFooter = require('../materialize/modal/footer');
var Input = require('../materialize/input');
var Checkbox = require('../materialize/checkbox');
var Submit = require('../materialize/submit');

var UserStore = require('../../stores/userStore');
var UserActions = require('../../actions/userActions');

var Login = React.createClass({
    propTypes: {
        buttonId: React.PropTypes.string.isRequired,
        formId: React.PropTypes.string,
        modalId: React.PropTypes.string,
        url: React.PropTypes.string
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onUserValidation')
    ],

    getDefaultProps () {
        return {
            formId: 'login-user',
            modalId: 'login-modal',
            url: '/login'
        };
    },

    _handleModalOpen () {
        return $("#user_login").focus();
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

    onUserValidation (userValidation) {
        let isValid = true;

        if (!$.isEmpty(userValidation.user) && !userValidation.user.login) {
            isValid = false;
            this.refs.userLogin.setInvalid(I18n.t('js.user.errors.login.invalid'));
        } else {
            this.refs.userLogin.setValid('\u2714');
        }

        if (!isValid) {
            this.refs.submitLogin.disabledSubmit();
        } else {
            this.refs.submitLogin.enabledSubmit();
        }

        return isValid;
    },

    render () {
        return (
            <Modal id={this.props.modalId}
                   buttonId={this.props.buttonId}
                   title={I18n.t('js.user.login.title')}
                   onOpen={this._handleModalOpen}>

                <form id={this.props.formId}
                      method="post"
                      action={this.props.url}
                      className="blog-modal-form"
                      data-remote="true"
                      acceptCharset="UTF-8"
                      noValidate="novalidate">

                    <div className="section">
                        <Input ref="userLogin"
                               id="user_login"
                               classType="important"
                               onBlur={this._handleInputBlur}
                               icon="account_circle">
                            {I18n.t('js.user.login.login')}
                        </Input>
                    </div>

                    <div className="section">
                        <Input id="user_password"
                               type="password"
                               classType="important"
                               icon="lock">
                            {I18n.t('js.user.login.password')}
                        </Input>
                    </div>

                    <div className="section">
                        <Checkbox id="user_remember_me">
                            {I18n.t('js.user.login.remember_me')}
                        </Checkbox>
                    </div>

                    <ModalFooter>
                        <a onClick={this._handleCancelClick}>
                            {I18n.t('js.user.login.cancel')}
                        </a>
                        <Submit ref="submitLogin"
                                id="login-submit">
                            {I18n.t('js.user.login.submit')}
                        </Submit>
                    </ModalFooter>

                </form>

            </Modal>
        );
    }
});

module.exports = Login;
