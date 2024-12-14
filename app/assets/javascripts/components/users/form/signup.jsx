import React from 'react';
import PropTypes from 'prop-types';

import {
    Field,
    Form
} from 'react-final-form';

import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

import I18n from '@js/modules/translations';

import {
    validateUser
} from '@js/actions/userActions';

import {
    terms
} from '@js/constants/routesHelper';

import EnsureValidity from '@js/components/modules/ensureValidity';

import TextFormField from '@js/components/material-ui/form/text';
import CheckBoxFormField from '@js/components/material-ui/form/checkbox';

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

    if (typeof values.terms !== 'undefined' && values.terms !== true) {
        errors.terms = I18n.t('js.user.errors.policy');
    }

    return errors;
};

let previousFieldValue;

const fieldValidation = (fieldType, fieldValue) => {
    if (fieldValue) {
        if (previousFieldValue === fieldValue) {
            return undefined;
        }

        previousFieldValue = fieldValue;
        return validateUser({[fieldType]: fieldValue})
            .then((response) => {
                if (response.success) {
                    return I18n.t('js.user.errors.pseudo.already_taken');
                }
            });
    } else {
        return undefined;
    }
};

const SignupForm = function ({onSubmit, onCancel}) {
    return (
        <Form validate={validate}
              onSubmit={onSubmit}>
            {
                ({handleSubmit, submitting}) => (
                    <form className="connection"
                          onSubmit={handleSubmit}>
                        <EnsureValidity/>

                        <Grid classes={{container: 'user-connection-container'}}
                              container={true}
                              spacing={2}
                              direction="column"
                              justifyContent="space-between"
                              alignItems="center">
                            <Grid classes={{item: 'user-connection-field-item'}}
                                  >
                                <Field name="pseudo"
                                       component={TextFormField}
                                       validate={fieldValidation.bind(this, 'pseudo')}
                                       id="user_pseudo_signup"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.signup.pseudo')}
                                       autoFocus={true}
                                       required={true}
                                       variant="standard"
                                       color="primary"
                                       slotProps={{
                                           input: {
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <AccountCircleIcon/>
                                                   </InputAdornment>
                                               )
                                           }
                                       }}/>
                            </Grid>

                            <Grid classes={{item: 'user-connection-field-item'}}
                                  >
                                <Field name="email"
                                       component={TextFormField}
                                       validate={fieldValidation.bind(this, 'pseudo')}
                                       id="user_pseudo_email"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.signup.email')}
                                       required={true}
                                       type="email"
                                       variant="standard"
                                       color="primary"
                                       slotProps={{
                                           input: {
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <EmailIcon/>
                                                   </InputAdornment>
                                               )
                                           }
                                       }}/>
                            </Grid>

                            <Grid classes={{item: 'user-connection-field-item'}}
                                  >
                                <Field name="password"
                                       component={TextFormField}
                                       id="user_password_signup"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.signup.password')}
                                       required={true}
                                       autoComplete="off"
                                       variant="standard"
                                       color="primary"
                                       type="password"
                                       slotProps={{
                                           input: {
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <LockIcon/>
                                                   </InputAdornment>
                                               )
                                           }
                                       }}/>
                            </Grid>

                            <Grid classes={{item: 'user-connection-field-item'}}
                                  >
                                <Field name="password_confirmation"
                                       component={TextFormField}
                                       id="user_password_confirmation_signup"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.signup.confirm_password')}
                                       required={true}
                                       autoComplete="off"
                                       variant="standard"
                                       color="primary"
                                       type="password"
                                       slotProps={{
                                           input: {
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <LockIcon/>
                                                   </InputAdornment>
                                               )
                                           }
                                       }}/>
                            </Grid>

                            <Grid >
                                <Field name="terms"
                                       type="checkbox"
                                       component={CheckBoxFormField}
                                       required={true}
                                       id="user_terms_signup"
                                       label={
                                           <span className="user-connection-terms">
                                                    {I18n.t('js.user.signup.terms_of_use', {website: window.settings.website_name}) + ' '}
                                               <a href={terms()}
                                                  target="_blank">
                                                        {I18n.t('js.user.signup.terms_of_use_name')}
                                               </a>
                                           </span>
                                       }
                                       variant="standard"
                                       color="primary"/>
                            </Grid>
                        </Grid>

                        <Grid className="center-align margin-top-20"
                              container={true}
                              spacing={2}
                              direction="row-reverse"
                              justifyContent="space-between"
                              alignItems="center">
                            <Grid >
                                <Button type="submit"
                                        id="signup-submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={submitting}>
                                    {I18n.t('js.user.signup.submit')}
                                </Button>
                            </Grid>

                            <Grid >
                                <Button onClick={onCancel}>
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
};

SignupForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default React.memo(SignupForm);

