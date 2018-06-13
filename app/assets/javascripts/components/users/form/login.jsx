'use strict';

import {
    Field,
    reduxForm
} from 'redux-form/immutable';

import {
    validateUser
} from '../../../actions/userActions';

import Input from '../../materialize/input';
import Submit from '../../materialize/submit';

import TextField from '../../materialize/form/text';
import CheckBoxField from '../../materialize/form/checkbox';

const asyncValidate = (values /*, dispatch */) => {
    if (values.get('login')) {
        return (
            validateUser(values.get('login')).then((response) => {
                if (!response.success) {
                    throw {
                        login: I18n.t('js.user.errors.login.invalid')
                    };
                }
            })
        );
    } else {
        return Promise.resolve();
    }
};

@reduxForm({
    form: 'login',
    asyncValidate,
    asyncBlurFields: ['login']
})
export default class LoginForm extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        // From reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        invalid: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className={classNames('blog-form', 'connection', {'form-invalid': this.props.invalid})}
                  onSubmit={this.props.handleSubmit}>
                <Input id="ensure_validity"
                       wrapperClassName="ensure-validity"
                       title={I18n.t('js.helpers.form.ensure_validity')}/>

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
                        <Field id="user_login_login"
                               name="login"
                               title={I18n.t('js.user.login.login')}
                               icon="account_circle"
                               labelClass="important"
                               isRequired={true}
                               hasAutoFocus={true}
                               component={TextField}/>
                    </div>

                    <div className="col s12">
                        <Field id="user_password_login"
                               name="password"
                               type="password"
                               title={I18n.t('js.user.login.password')}
                               icon="lock"
                               labelClass="important"
                               isRequired={true}
                               component={TextField}/>
                    </div>
                </div>

                <div className="connection-checkbox margin-bottom-20">
                    <Field id="user_remember_me"
                           name="remember_me"
                           title={I18n.t('js.user.login.remember_me')}
                           isDefaultChecked={true}
                           isRequired={true}
                           component={CheckBoxField}/>
                </div>

                <div className="left margin-bottom-20">
                    <a className="btn-flat waves-effect waves-spectra"
                       href="#"
                       onClick={this.props.onCancel}>
                        {I18n.t('js.user.login.cancel')}
                    </a>
                </div>

                <div className="right">
                    <Submit id="login-submit"
                            disabled={this.props.submitting}>
                        {I18n.t('js.user.login.submit')}
                    </Submit>
                </div>
            </form>
        );
    }
}

