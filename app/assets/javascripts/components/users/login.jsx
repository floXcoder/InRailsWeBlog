'use strict';

const Form = require('../materialize/form');
const Modal = require('../materialize/modal/modal');
const ModalFooter = require('../materialize/modal/footer');
const Input = require('../materialize/input');
const Checkbox = require('../materialize/checkbox');
const Submit = require('../materialize/submit');

var Login = React.createClass({
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
            formId: 'login-user',
            modalId: 'login-modal',
            url: '/login',
            validationUrl: '/users/validation',
            isOpened: false
        };
    },

    componentDidMount () {
        if(this.props.isOpened) {
            $('#' + this.props.modalId).openModal();
        }
    },

    componentDidUpdate () {
        if(this.props.isOpened) {
            $('#' + this.props.modalId).openModal();
        }
    },

    _handleModalOpen () {
        return $('#login-user-login').focus();
    },

    _handleCancelClick () {
        $('#' + this.props.modalId).closeModal();
    },

    render () {
        return (
            <Modal id={this.props.modalId}
                   launcherClass={this.props.launcherClass}
                   title={I18n.t('js.user.login.title')}
                   onOpen={this._handleModalOpen}>

                <Form ref="loginForm"
                      id={this.props.formId}
                      action={this.props.url}
                      isValidating={true}>

                    <div className="section">
                        <Input ref="userLogin"
                               id="login-user-login"
                               name="user[login]"
                               title={I18n.t('js.user.login.login')}
                               labelClass="important"
                               isRequired={true}
                               validator={{
                               'data-parsley-remote': this.props.validationUrl,
                               'data-parsley-remote-message': I18n.t('js.user.errors.login.invalid')
                               }}
                               icon="account_circle"/>
                    </div>

                    <div className="section">
                        <Input id="login-user-password"
                               name="user[password]"
                               type="password"
                               title={I18n.t('js.user.login.password')}
                               labelClass="important"
                               isRequired={true}
                               icon="lock"/>
                    </div>

                    <div className="section">
                        <Checkbox title={I18n.t('js.user.login.remember_me')}
                                  id="login-user-remember-me"
                                  name="user[remember_me]"/>
                    </div>

                    <ModalFooter>
                        <div className="left">
                            <a className="waves-effect waves-teal btn-flat"
                               href="#"
                               onClick={this._handleCancelClick}>
                                {I18n.t('js.user.login.cancel')}
                            </a>
                        </div>

                        <div className="right">
                            <Submit id="login-submit">
                                {I18n.t('js.user.login.submit')}
                            </Submit>
                        </div>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
});

module.exports = Login;
