import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import {
    Field,
    Form
} from 'react-final-form';

import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

import I18n from '@js/modules/translations';

import {
    newPasswordPath
} from '@js/constants/routesHelper';

// import {
//     validateUser
// } from '@js/actions/userActions';
import EnsureValidity from '@js/components/modules/ensureValidity';

import TextFormField from '@js/components/material-ui/form/text';
import CheckBoxFormField from '@js/components/material-ui/form/checkbox';

// let previousLoginValue;
// const loginValidation = (loginValue) => {
//     if (loginValue) {
//         if(previousLoginValue === loginValue) {
//             return undefined;
//         }
//
//         previousLoginValue = loginValue;
//
//         return (
//             validateUser(loginValue).then((response) => {
//                 if (!response.success) {
//                     return I18n.t('js.user.errors.login.invalid');
//                 }
//             })
//         );
//     } else {
//         return undefined;
//     }
// };


const LoginForm = function ({
                                onSubmit,
                                onCancel
                            }) {
    return (
        <Form onSubmit={onSubmit}>
            {
                ({
                     handleSubmit,
                     submitting
                 }) => (
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
                                <Field name="login"
                                       component={TextFormField}
                                       id="user_login_login"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.login.login')}
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
                                <Field name="password"
                                       component={TextFormField}
                                       id="user_password_login"
                                       className="user-connection-text-field"
                                       label={I18n.t('js.user.login.password')}
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

                            <Grid>
                                <Field name="remember_me"
                                       type="checkbox"
                                       component={CheckBoxFormField}
                                       id="user_remember_me"
                                       defaultValue={true}
                                       label={I18n.t('js.user.login.remember_me')}
                                       color="primary"/>
                            </Grid>
                        </Grid>

                        <div>
                            <Link className="user-connection-password"
                                  to={newPasswordPath()}
                                  onClick={onCancel}>
                                {I18n.t('js.user.login.new_password')}
                            </Link>
                        </div>

                        <Grid className="center-align"
                              container={true}
                              spacing={2}
                              direction="row-reverse"
                              justifyContent="space-between"
                              alignItems="center">
                            <Grid>
                                <Button type="submit"
                                        id="login-submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={submitting}>
                                    {I18n.t('js.user.login.submit')}
                                </Button>
                            </Grid>

                            <Grid>
                                <Button onClick={onCancel}>
                                    {I18n.t('js.user.login.cancel')}
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
                        {/*                {I18n.t('js.user.login.externals.google')}*/}
                        {/*            </a>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*    <div className="col s12 l6">*/}
                        {/*        <div className="connection-facebook">*/}
                        {/*            <a className="connection-facebook-button"*/}
                        {/*               href="/users/auth/facebook">*/}
                        {/*                {I18n.t('js.user.login.externals.facebook')}*/}
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

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default React.memo(LoginForm);

