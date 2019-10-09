'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

import styles from '../../../jss/user/password';

export default @withStyles(styles)
class UserPassword extends React.Component {
    static propTypes = {
        resetPasswordToken: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        resetPasswordToken: (new URL(window.location)).searchParams.get('reset_password_token') || null,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const csrfToken = document.getElementsByName('csrf-token')[0];
        const token = csrfToken && csrfToken.getAttribute('content');

        return (
            <Container className={this.props.classes.container}
                       maxWidth="md">
                <form className="connection"
                      action="/api/v1/users/password"
                      autoComplete="off"
                      noValidate="novalidate"
                      acceptCharset="UTF-8"
                      method="POST">
                    <input type="hidden"
                           name="authenticity_token"
                           value={token}/>

                    {
                        this.props.resetPasswordToken &&
                        <>
                            <input type="hidden"
                                   name="_method"
                                   value="put"/>

                            <input type="hidden"
                                   name="user[reset_password_token]"
                                   value={this.props.resetPasswordToken}/>
                        </>
                    }

                    <Typography className={this.props.classes.title}
                                variant="h1"
                                component="h1">
                        {
                            this.props.resetPasswordToken
                                ?
                                I18n.t('js.user.password.edit.title')
                                :
                                I18n.t('js.user.password.new.title')
                        }
                    </Typography>

                    {
                        this.props.resetPasswordToken
                            ?
                            <Grid container={true}
                                  spacing={2}
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center">
                                <Grid classes={{item: this.props.classes.fieldItem}}
                                      item={true}>
                                    <TextField id="user_password"
                                               name="user[password]"
                                               className={this.props.classes.textField}
                                               label={I18n.t('js.user.password.edit.password')}
                                               required={true}
                                               autoFocus={true}
                                               color="primary"
                                               type="password"
                                               InputProps={{
                                                   startAdornment: (
                                                       <InputAdornment position="start">
                                                           <LockIcon/>
                                                       </InputAdornment>
                                                   )
                                               }}/>

                                    <TextField id="user_password_confirmation"
                                               name="user[password_confirmation]"
                                               className={this.props.classes.textField}
                                               label={I18n.t('js.user.password.edit.password_confirmation')}
                                               required={true}
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
                            </Grid>
                            :
                            <Grid container={true}
                                  spacing={2}
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center">
                                <Grid classes={{item: this.props.classes.fieldItem}}
                                      item={true}>
                                    <TextField id="user_email"
                                               name="user[email]"
                                               className={this.props.classes.textField}
                                               label={I18n.t('js.user.password.new.email')}
                                               required={true}
                                               autoFocus={true}
                                               color="primary"
                                               InputProps={{
                                                   startAdornment: (
                                                       <InputAdornment position="start">
                                                           <EmailIcon/>
                                                       </InputAdornment>
                                                   )
                                               }}/>
                                </Grid>
                            </Grid>
                    }

                    <div className="margin-top-25 margin-bottom-25">
                        <Link className={this.props.classes.link}
                              to="/">
                            {I18n.t('js.user.password.new.back')}
                        </Link>
                    </div>

                    <div className="center-align margin-top-35 margin-bottom-25">
                        <Button type="submit"
                                id="login-submit"
                                variant="contained"
                                color="primary">
                            {
                                this.props.resetPasswordToken
                                    ?
                                    I18n.t('js.user.password.new.button')
                                    :
                                    I18n.t('js.user.password.edit.button')
                            }
                        </Button>
                    </div>
                </form>
            </Container>
        );
    }
}

