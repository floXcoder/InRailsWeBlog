'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PortraitIcon from '@mui/icons-material/Portrait';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';

import {
    userHomePath
} from '../../../../constants/routesHelper';


function HeaderUserMenu(props) {
    const adminContent = (
        <>
            <ListItem button={true}
                      component="a"
                      className="layout-header-link"
                      href="/admins">
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.administration')}
                </ListItemText>
            </ListItem>

            <Divider/>
        </>
    );

    return (
        <List className={classNames({
            'layout-header-nestedMenu': props.isNested
        })}
              component="div"
              disablePadding={props.isNested}>
            {
                props.isAdminConnected &&
                adminContent
            }

            <ListItem button={true}
                      component={Link}
                      className="layout-header-link"
                      to={userHomePath(props.userSlug)}>
                <ListItemIcon>
                    <PortraitIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.profile')}
                </ListItemText>
            </ListItem>

            <ListItem button={true}
                      onClick={props.onPreferenceClick}>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.settings')}
                </ListItemText>
            </ListItem>

            <ListItem button={true}
                      onClick={props.onLogoutClick}
                      rel="nofollow">
                <ListItemIcon>
                    <CancelIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.log_out')}
                </ListItemText>
            </ListItem>
        </List>
    );
}

HeaderUserMenu.propTypes = {
    userSlug: PropTypes.string.isRequired,
    onPreferenceClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
    isNested: PropTypes.bool,
    isAdminConnected: PropTypes.bool
};

HeaderUserMenu.defaultProps = {
    isNested: false,
    isAdminConnected: false
};

export default HeaderUserMenu;
