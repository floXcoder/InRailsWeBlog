'use strict';

import {
    Field,
    reduxForm
} from 'redux-form/immutable';

import {
    validateUser
} from '../../../actions/userActions';

import Submit from '../../materialize/submit';

import TextField from '../../materialize/form/text';
import CheckBoxField from '../../materialize/form/checkbox';

const validate = (values) => {
    const errors = {};

    const pseudo = values.get('pseudo');
    if (pseudo) {
        if (pseudo.length < window.settings.user_pseudo_min_length || pseudo.length > window.settings.user_pseudo_max_length) {
            errors.pseudo = I18n.t('js.user.errors.pseudo.size', {
                min: window.settings.user_pseudo_min_length,
                max: window.settings.user_pseudo_max_length
            });
        }
    }

    const email = values.get('email');
    if (email) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = I18n.t('js.user.errors.email.invalid');
        }
    }

    const password = values.get('password');
    const passwordConfirmation = values.get('password_confirmation');
    if (password) {
        if (password.length < window.settings.user_password_min_length || password.length > window.settings.user_password_max_length) {
            errors.password = I18n.t('js.user.errors.password.size', {
                min: window.settings.user_password_min_length,
                max: window.settings.user_password_max_length
            });
        }
    }

    if (password && passwordConfirmation) {
        if (password !== passwordConfirmation) {
            errors.password_confirmation = I18n.t('js.user.errors.password.mismatch');
        }
    }

    const terms = values.get('terms');
    if (!terms) {
        errors.terms = I18n.t('js.user.errors.policy');
    }

    return errors;
};

const asyncValidate = (values /*, dispatch */) => {
    if (values.get('pseudo')) {
        return (
            validateUser(values.get('pseudo')).then((response) => {
                if (response.success) {
                    throw {
                        pseudo: I18n.t('js.user.errors.pseudo.already_taken')
                    };
                }
            })
        );
    } else {
        return Promise.resolve();
    }
};

@reduxForm({
    form: 'signup',
    validate,
    asyncValidate,
    asyncBlurFields: ['pseudo']
})
export default class SignupForm extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        // from reduxForm
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
                        <Field id="user_pseudo_signup"
                               name="pseudo"
                               title={I18n.t('js.user.signup.pseudo')}
                               icon="account_circle"
                               labelClass="important"
                               isRequired={true}
                               hasAutoFocus={true}
                               component={TextField}/>
                    </div>

                    <div className="col s12 l6">
                        <Field id="user_pseudo_email"
                               name="email"
                               title={I18n.t('js.user.signup.email')}
                               icon="email"
                               labelClass="important"
                               isRequired={true}
                               component={TextField}/>
                    </div>
                </div>

                <div className="row margin-bottom-0">
                    <div className="col s12 l6">
                        <Field id="user_password_signup"
                               name="password"
                               type="password"
                               title={I18n.t('js.user.signup.password')}
                               icon="lock"
                               labelClass="important"
                               isRequired={true}
                               component={TextField}/>
                    </div>

                    <div className="col s12 l6">
                        <Field id="user_password_confirmation_signup"
                               name="password_confirmation"
                               type="password"
                               title={I18n.t('js.user.signup.confirm_password')}
                               icon="lock"
                               labelClass="important"
                               isRequired={true}
                               component={TextField}/>
                    </div>
                </div>

                <div className="connection-checkbox margin-bottom-20">
                    <Field id="user_terms_signup"
                           name="terms"
                           title={
                               <span>
                                   {I18n.t('js.user.signup.terms_of_use', {website: window.settings.website_name}) + ' '}
                                   <a href="/terms">
                                        {I18n.t('js.user.signup.terms_of_use_name')}
                                   </a>
                               </span>
                           }
                           isRequired={true}
                           component={CheckBoxField}/>
                </div>

                <div className="left margin-bottom-20">
                    <a className="btn-flat waves-effect waves-spectra"
                       href="#"
                       onClick={this.props.onCancel}>
                        {I18n.t('js.user.signup.cancel')}
                    </a>
                </div>

                <div className="right">
                    <Submit id="signup-submit"
                            disabled={this.props.submitting}>
                        {I18n.t('js.user.signup.submit')}
                    </Submit>
                </div>
            </form>
        );
    }
}

