import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    Link
} from 'react-router';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import {
    fetchMetaTags
} from '@js/actions/uiActions';

import {
    rootPath
} from '@js/constants/routesHelper';

import '@css/pages/user/connection.scss';


class UserPassword extends React.Component {
    static propTypes = {
        resetPasswordToken: PropTypes.string,
        // from connect
        fetchMetaTags: PropTypes.func
    };

    static defaultProps = {
        resetPasswordToken: (new URL(window.location)).searchParams.get('reset_password_token') || null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchMetaTags('new_password');
    }

    render() {
        const csrfToken = document.getElementsByName('csrf-token')[0];
        const token = csrfToken?.getAttribute('content');

        return (
            <Container className="user-password-container"
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
                        !!this.props.resetPasswordToken &&
                        <>
                            <input type="hidden"
                                   name="_method"
                                   value="put"/>

                            <input type="hidden"
                                   name="user[reset_password_token]"
                                   value={this.props.resetPasswordToken}/>
                        </>
                    }

                    <Typography className="user-password-title"
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
                                  justifyContent="space-between"
                                  alignItems="center">
                                <Grid classes={{item: 'user-password-field-item'}}>
                                    <TextField id="user_password"
                                               name="user[password]"
                                               className="user-password-text-field"
                                               label={I18n.t('js.user.password.edit.password')}
                                               required={true}
                                               autoFocus={true}
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

                                    <TextField id="user_password_confirmation"
                                               name="user[password_confirmation]"
                                               className="user-password-text-field"
                                               label={I18n.t('js.user.password.edit.password_confirmation')}
                                               required={true}
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
                            </Grid>
                            :
                            <Grid container={true}
                                  spacing={2}
                                  direction="column"
                                  justifyContent="space-between"
                                  alignItems="center">
                                <Grid classes={{item: 'user-password-field-item'}}>
                                    <TextField id="user_email"
                                               name="user[email]"
                                               className="user-password-text-field"
                                               label={I18n.t('js.user.password.new.email')}
                                               required={true}
                                               autoFocus={true}
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
                            </Grid>
                    }

                    <div className="margin-top-25 margin-bottom-25">
                        <Link className="user-password-link"
                              to={rootPath()}>
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

export default connect(null, {
    fetchMetaTags
})(UserPassword);