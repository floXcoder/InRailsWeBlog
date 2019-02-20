'use strict';

import {
    Field,
    reduxForm
} from 'redux-form/immutable';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';

import {
    validateUser
} from '../../../actions/userActions';

import EnsureValidity from '../../modules/ensureValidity';

import TextFieldForm from '../../material-ui/form/text';
import CheckBoxForm from '../../material-ui/form/checkbox';

import styles from '../../../../jss/user/connection';

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
        return validateUser(values.get('pseudo')).then((response) => {
            if (response.success) {
                throw {
                    pseudo: I18n.t('js.user.errors.pseudo.already_taken')
                };
            }
        });
    } else {
        return Promise.resolve();
    }
};

export default @reduxForm({
    form: 'signup',
    validate,
    asyncValidate,
    asyncBlurFields: ['pseudo']
})
@withStyles(styles)
class SignupForm extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        // from reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        invalid: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className={classNames('connection', {'form-invalid': this.props.invalid})}
                  onSubmit={this.props.handleSubmit}>
                <EnsureValidity/>

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

                <Grid classes={{container: this.props.classes.fieldItem}}
                      container={true}
                      spacing={16}
                      direction="column"
                      justify="space-between"
                      alignItems="center">
                    <Grid classes={{item: this.props.classes.fieldItem}}
                          item={true}>
                        <Field name="pseudo"
                               component={TextFieldForm}
                               id="user_pseudo_signup"
                               className={this.props.classes.textField}
                               label={I18n.t('js.user.signup.pseudo')}
                               autoFocus={true}
                               required={true}
                               color="primary"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <AccountCircleIcon/>
                                       </InputAdornment>
                                   )
                               }}/>
                    </Grid>

                    <Grid classes={{item: this.props.classes.fieldItem}}
                          item={true}>
                        <Field name="email"
                               component={TextFieldForm}
                               id="user_pseudo_email"
                               className={this.props.classes.textField}
                               label={I18n.t('js.user.signup.email')}
                               required={true}
                               color="primary"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <EmailIcon/>
                                       </InputAdornment>
                                   )
                               }}/>
                    </Grid>

                    <Grid classes={{item: this.props.classes.fieldItem}}
                          item={true}>
                        <Field name="password"
                               component={TextFieldForm}
                               id="user_password_signup"
                               className={this.props.classes.textField}
                               label={I18n.t('js.user.signup.password')}
                               required={true}
                               autoComplete="off"
                               color="primary"
                               type="password"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <LockIcon/>
                                       </InputAdornment>
                                   )
                               }}/>
                    </Grid>

                    <Grid classes={{item: this.props.classes.fieldItem}}
                          item={true}>
                        <Field name="password_confirmation"
                               component={TextFieldForm}
                               id="user_password_confirmation_signup"
                               className={this.props.classes.textField}
                               label={I18n.t('js.user.signup.confirm_password')}
                               required={true}
                               autoComplete="off"
                               color="primary"
                               type="password"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <LockIcon/>
                                       </InputAdornment>
                                   )
                               }}/>
                    </Grid>

                    <Grid item={true}>
                        <Field name="terms"
                               component={CheckBoxForm}
                               id="user_terms_signup"
                               label={
                                   <span>
                                        {I18n.t('js.user.signup.terms_of_use', {website: window.settings.website_name}) + ' '}
                                       <a href="/terms">
                                            {I18n.t('js.user.signup.terms_of_use_name')}
                                       </a>
                                   </span>
                               }
                               color="primary"/>
                    </Grid>
                </Grid>

                <Grid className="center-align margin-top-15"
                      container={true}
                      spacing={16}
                      direction="row-reverse"
                      justify="center"
                      alignItems="center">
                    <Grid item={true}>
                        <Button type="submit"
                                id="signup-submit"
                                variant="contained"
                                color="primary"
                                disabled={this.props.submitting}>
                            {I18n.t('js.user.signup.submit')}
                        </Button>
                    </Grid>

                    <Grid item={true}>
                        <Button onClick={this.props.onCancel}>
                            {I18n.t('js.user.signup.cancel')}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

