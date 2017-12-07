'use strict';

import Form from '../materialize/form';
import Modal from '../materialize/modal/modal';
import ModalFooter from '../materialize/modal/footer';

import Input from '../materialize/input';
import Checkbox from '../materialize/checkbox';
import Submit from '../materialize/submit';

export default class Login extends React.PureComponent {
    static propTypes = {
        launcherClass: PropTypes.string.isRequired,
        formId: PropTypes.string,
        modalId: PropTypes.string,
        url: PropTypes.string,
        validationUrl: PropTypes.string
    };

    static defaultProps = {
        formId: 'login-user',
        modalId: 'login-modal',
        url: '/login',
        validationUrl: '/users/validation'
    };

    constructor(props) {
        super(props);
    }

    _handleModalOpen = () => {
        return $('#user_login').focus();
    };

    _handleCancelClick = () => {
        $('#' + this.props.modalId).modal('close');
    };

    render() {
        return (
            <Modal id={this.props.modalId}
                   launcherClass={this.props.launcherClass}
                   title={I18n.t('js.user.login.title')}
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
                                    {I18n.t('js.user.login.externals.google')}
                                </a>
                            </div>
                        </div>

                        <div className="col s12 l6">
                            <div className="connection-facebook">
                                <a className="connection-facebook-button"
                                   href="/users/auth/facebook">
                                    {I18n.t('js.user.login.externals.facebook')}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="connection-or-separator hr-around-text">
                        {I18n.t('js.helpers.or')}
                    </div>

                    <div className="row margin-bottom-0">
                        <div className="col s12">
                            <Input id="user_login_login"
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

                        <div className="col s12">
                            <Input id="user_password_login"
                                   name="user[password]"
                                   type="password"
                                   title={I18n.t('js.user.login.password')}
                                   labelClass="important"
                                   isRequired={true}
                                   icon="lock"/>
                        </div>
                    </div>

                    <div className="connection-checkbox margin-bottom-20">
                        <Checkbox id="user_remember_me"
                                  name="user[remember_me]"
                                  title={I18n.t('js.user.login.remember_me')}
                                  isDefaultChecked={true}/>
                    </div>

                    <ModalFooter>
                        <div className="left">
                            <a className="btn-flat waves-effect waves-spectra"
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
}

