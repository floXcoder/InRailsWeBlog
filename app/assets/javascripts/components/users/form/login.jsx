'use strict';

import {
    Link
} from 'react-router-dom';

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

import {
    validateUser
} from '../../../actions/userActions';

import EnsureValidity from '../../modules/ensureValidity';

import TextFormField from '../../material-ui/form/text';
import CheckBoxFormField from '../../material-ui/form/checkbox';

import styles from '../../../../jss/user/connection';

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


export default @reduxForm({
    form: 'login',
    asyncValidate,
    asyncBlurFields: ['login']
})
@withStyles(styles)
class LoginForm extends React.Component {
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

                <Grid classes={{container: this.props.classes.container}}
                      container={true}
                      spacing={2}
                      direction="column"
                      justify="space-between"
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
                          to="/users/password/new"
                          onClick={this.props.onCancel}>
                        {I18n.t('js.user.login.new_password')}
                    </Link>
                </div>

                <Grid className="center-align margin-top-15 margin-bottom-25"
                      container={true}
                      spacing={2}
                      direction="row-reverse"
                      justify="space-between"
                      alignItems="center">
                    <Grid item={true}>
                        <Button type="submit"
                                id="login-submit"
                                variant="contained"
                                color="primary"
                                disabled={this.props.submitting}>
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
        );
    }
}

