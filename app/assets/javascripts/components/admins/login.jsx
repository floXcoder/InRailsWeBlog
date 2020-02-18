'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';

import styles from '../../../jss/admin/connection';

export default @withStyles(styles)
class AdminLogin extends React.Component {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const csrfToken = document.getElementsByName('csrf-token')[0];
        const token = csrfToken?.getAttribute('content');

        return (
            <Container className={this.props.classes.container}
                       maxWidth="sm">
                <Paper className={this.props.classes.paper}>
                    <form className="connection"
                          action="/admins/sign_in"
                          autoComplete="off"
                          noValidate="novalidate"
                          acceptCharset="UTF-8"
                          method="post">
                        <input type="hidden"
                               name="authenticity_token"
                               value={token}/>

                        <Typography className={this.props.classes.title}
                                    variant="h1"
                                    component="h1">
                            {I18n.t('js.user.login.title')}
                        </Typography>

                        <Grid container={true}
                              spacing={2}
                              direction="column"
                              justify="space-between"
                              alignItems="center">
                            <Grid classes={{item: this.props.classes.fieldItem}}
                                  item={true}>
                                <TextField id="admin_login"
                                           name="admin[login]"
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
                                <TextField id="admin_password"
                                           name="admin[password]"
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
                                <FormControlLabel label={I18n.t('js.user.login.remember_me')}
                                                  labelPlacement="end"
                                                  control={
                                                      <Checkbox id="admin_remember_me"
                                                                name="admin[remember_me]"
                                                                type="checkbox"
                                                                color="primary"/>
                                                  }/>
                            </Grid>
                        </Grid>

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
}

