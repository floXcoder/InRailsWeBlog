'use strict';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';


function AdminLogin() {
    const csrfToken = document.getElementsByName('csrf-token')[0];
    const token = csrfToken?.getAttribute('content');

    return (
        <Container className="admin-login-container"
                   maxWidth="sm">
            <Paper className="admin-login-paper">
                <form className="connection"
                      action="/admins/sign_in"
                      autoComplete="off"
                      noValidate="novalidate"
                      acceptCharset="UTF-8"
                      method="post">
                    <input type="hidden"
                           name="authenticity_token"
                           value={token}/>

                    <Typography className="admin-login-title"
                                variant="h1"
                                component="h1">
                        {I18n.t('js.user.login.title')}
                    </Typography>

                    <Grid container={true}
                          spacing={2}
                          direction="column"
                          justifyContent="space-between"
                          alignItems="center">
                        <Grid classes={{item: 'admin-login-field-item'}}
                              item={true}>
                            <TextField id="admin_login"
                                       name="admin[login]"
                                       className="admin-login-text-field"
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

                        <Grid classes={{item: 'admin-login-field-item'}}
                              item={true}>
                            <TextField id="admin_password"
                                       name="admin[password]"
                                       className="admin-login-text-field"
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
                            <FormControlLabel label={I18n.t('js.user.login.remember_me')}
                                              labelPlacement="end"
                                              control={
                                                  <Checkbox id="admin_remember_me"
                                                            name="admin[remember_me]"
                                                            defaultChecked={true}
                                                            type="checkbox"
                                                            color="primary"/>
                                              }/>
                        </Grid>
                    </Grid>

                    <Grid className="center-align margin-top-15 margin-bottom-25"
                          container={true}
                          spacing={2}
                          direction="row-reverse"
                          justifyContent="space-between"
                          alignItems="center">
                        <Grid item={true}>
                            <Button type="submit"
                                    id="login-submit"
                                    variant="contained"
                                    color="primary">
                                {I18n.t('js.user.login.submit')}
                            </Button>
                        </Grid>

                        <Grid item={true}>
                            <Button href="/">
                                {I18n.t('js.user.login.cancel')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default AdminLogin;
