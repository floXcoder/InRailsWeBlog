'use strict';

import {
    Link
} from 'react-router-dom';

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

import {
    newPasswordPath
} from '../../../constants/routesHelper';

// import {
//     validateUser
// } from '../../../actions/userActions';

import EnsureValidity from '../../modules/ensureValidity';

import TextFormField from '../../material-ui/form/text';
import CheckBoxFormField from '../../material-ui/form/checkbox';

import styles from '../../../../jss/user/connection';

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


export default @withStyles(styles)
class LoginForm extends React.Component {
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
            <Form onSubmit={this.props.onSubmit}>
                {
                    ({handleSubmit, submitting}) => (
                        <form className="connection"
                              onSubmit={handleSubmit}>
                            <EnsureValidity/>

                            <Grid classes={{container: this.props.classes.container}}
                                  container={true}
                                  spacing={2}
                                  direction="column"
                                  justifyContent="space-between"
                                  alignItems="center">
                                <Grid classes={{item: this.props.classes.fieldItem}}
                                      item={true}>
                                    <Field name="login"
                                           component={TextFormField}
                                           id="user_login_login"
                                           className={this.props.classes.textField}
                                           label={I18n.t('js.user.login.login')}
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
                                    <Field name="password"
                                           component={TextFormField}
                                           id="user_password_login"
                                           className={this.props.classes.textField}
                                           label={I18n.t('js.user.login.password')}
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
                                    <Field name="remember_me"
                                           type="checkbox"
                                           component={CheckBoxFormField}
                                           id="user_remember_me"
                                           label={I18n.t('js.user.login.remember_me')}
                                           color="primary"/>
                                </Grid>
                            </Grid>

                            <div>
                                <Link className={this.props.classes.password}
                                      to={newPasswordPath()}
                                      onClick={this.props.onCancel}>
                                    {I18n.t('js.user.login.new_password')}
                                </Link>
                            </div>

                            <Grid className="center-align"
                                  container={true}
                                  spacing={2}
                                  direction="row-reverse"
                                  justifyContent="space-between"
                                  alignItems="center">
                                <Grid item={true}>
                                    <Button type="submit"
                                            id="login-submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={submitting}>
                                        {I18n.t('js.user.login.submit')}
                                    </Button>
                                </Grid>

                                <Grid item={true}>
                                    <Button onClick={this.props.onCancel}>
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
    }
}

