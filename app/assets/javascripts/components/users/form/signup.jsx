'use strict';

import {
    Form,
    Field
} from 'react-final-form';

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
} from '../../../actions';

import {
    terms
} from '../../../constants/routesHelper';

import EnsureValidity from '../../modules/ensureValidity';

import TextFormField from '../../material-ui/form/text';
import CheckBoxFormField from '../../material-ui/form/checkbox';

import styles from '../../../../jss/user/connection';

const validate = (values) => {
    const errors = {};

    const pseudo = values.pseudo;
    if (pseudo) {
        if (pseudo.length < window.settings.user_pseudo_min_length || pseudo.length > window.settings.user_pseudo_max_length) {
            errors.pseudo = I18n.t('js.user.errors.pseudo.size', {
                min: window.settings.user_pseudo_min_length,
                max: window.settings.user_pseudo_max_length
            });
        }
    }

    const email = values.email;
    if (email) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = I18n.t('js.user.errors.email.invalid');
        }
    }

    const password = values.password;
    const passwordConfirmation = values.password_confirmation;
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

    const terms = values.terms;
    if (typeof values.terms !== 'undefined' && terms !== true) {
        errors.terms = I18n.t('js.user.errors.policy');
    }

    return errors;
};

let previousLoginValue;

const pseudoValidation = (loginValue) => {
    if (loginValue) {
        if(previousLoginValue === loginValue) {
            return undefined;
        }

        previousLoginValue = loginValue;
        return validateUser(loginValue).then((response) => {
            if (response.success) {
                return I18n.t('js.user.errors.pseudo.already_taken');
            }
        });
    } else {
        return undefined;
    }
};

export default @withStyles(styles)
class SignupForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form validate={validate}
                  onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, submitting}) => (
                        <form className="connection"
                              onSubmit={handleSubmit}>
                            <EnsureValidity/>

                            <Grid classes={{container: this.props.classes.container}}
                                  container={true}
                                  spacing={2}
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center">
                                <Grid classes={{item: this.props.classes.fieldItem}}
                                      item={true}>
                                    <Field name="pseudo"
                                           component={TextFormField}
                                           validate={pseudoValidation}
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
                                           component={TextFormField}
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
                                           component={TextFormField}
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
                                           component={TextFormField}
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
                                           type="checkbox"
                                           component={CheckBoxFormField}
                                           required={true}
                                           id="user_terms_signup"
                                           label={
                                               <span className={this.props.classes.terms}>
                                                    {I18n.t('js.user.signup.terms_of_use', {website: window.settings.website_name}) + ' '}
                                                   <a href={terms()}
                                                      target="_blank">
                                                        {I18n.t('js.user.signup.terms_of_use_name')}
                                                   </a>
                                               </span>
                                           }
                                           color="primary"/>
                                </Grid>
                            </Grid>

                            <Grid className="center-align margin-top-25 margin-bottom-25"
                                  container={true}
                                  spacing={2}
                                  direction="row-reverse"
                                  justify="space-between"
                                  alignItems="center">
                                <Grid item={true}>
                                    <Button type="submit"
                                            id="signup-submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={submitting}>
                                        {I18n.t('js.user.signup.submit')}
                                    </Button>
                                </Grid>

                                <Grid item={true}>
                                    <Button onClick={this.props.onCancel}>
                                        {I18n.t('js.user.signup.cancel')}
                                    </Button>
                                </Grid>
                            </Grid>

                            {/*<div className="connection-or-separator hr-around-text">*/}
                            {/*    {I18n.t('js.helpers.or')}*/}
                            {/*</div>*/}

                            {/*<div className="row connection-externals margin-top-20 margin-bottom-5">*/}
                            {/*    <div className="col s12 l6">*/}
                            {/*        <div className="connection-google">*/}
                            {/*            <a className="connection-google-button"*/}
                            {/*               href="/users/auth/google_oauth2">*/}
                            {/*                {I18n.t('js.user.signup.externals.google')}*/}
                            {/*            </a>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*    <div className="col s12 l6">*/}
                            {/*        <div className="connection-facebook">*/}
                            {/*            <a className="connection-facebook-button"*/}
                            {/*               href="/users/auth/facebook">*/}
                            {/*                {I18n.t('js.user.signup.externals.facebook')}*/}
                            {/*            </a>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </form>
                    )
                }
            </Form>
        );
    }
}

