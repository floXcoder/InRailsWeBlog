'use strict';

import {Link} from 'react-router';

import {FlatButton, FontIcon, MenuItem, IconMenu, Divider} from 'material-ui';

var HomeUserHeader = ({onLoginClick, onSignupClick}) => (
    <IconMenu
        iconButtonElement={
            <FlatButton secondary={true}
                        className="header-button"
                        icon={
                            $app.user.isConnected() && $app.user.current.avatar
                                ?
                                <img src={$app.user.current.avatar}
                                     alt="User Avatar"
                                     className="header-avatar"/>
                                :
                                <FontIcon className="material-icons">account_circle</FontIcon>
                        }/>
        }
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}>

        <MenuItem primaryText={I18n.t('js.header.user.languages.french')}
                  href={window.location.href + '?locale=fr'}/>
        <MenuItem primaryText={I18n.t('js.header.user.languages.english')}
                  href={window.location.href + '?locale=en'}/>

        <Divider />

        {
            $app.user.isAdmin() &&
            <MenuItem primaryText={I18n.t('js.header.user.administration')}
                      activeClassName="link-active"
                      href="/admin"/>
        }

        {
            $app.user.isAdmin() &&
            <Divider />
        }

        {
            !$app.user.isConnected() &&
            <MenuItem primaryText={I18n.t('js.header.user.log_in')}
                      onTouchTap={(event) => HomeUserHeader._handleLoginClick(onLoginClick, event)}/>
        }
        {
            !$app.user.isConnected() &&
            <MenuItem primaryText={I18n.t('js.header.user.sign_up')}
                      onTouchTap={(event) => HomeUserHeader._handleSignupClick(onSignupClick, event)}/>
        }
        {
            $app.user.isConnected() &&
            <MenuItem
                primaryText={
                    <Link to={`/user/profile/${$app.user.current.slug}`}>
                        {I18n.t('js.header.user.profile')}
                    </Link>
                }/>
        }
        {
            $app.user.isConnected() &&
            <MenuItem primaryText={I18n.t('js.header.user.log_out')}
                      href="/logout"
                      data-method="delete"
                      rel="nofollow"/>
        }
    </IconMenu>
);

HomeUserHeader.propTypes = {
    onLoginClick: React.PropTypes.func.isRequired,
    onSignupClick: React.PropTypes.func.isRequired
};

HomeUserHeader._handleLoginClick = (onLoginClick, event) => {
    event.preventDefault();
    onLoginClick();
    return false;
};

HomeUserHeader._handleSignupClick = (onSignupClick, event) => {
    event.preventDefault();
    onSignupClick();
    return false;
};

module.exports = HomeUserHeader;
