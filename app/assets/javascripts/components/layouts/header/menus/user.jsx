import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PortraitIcon from '@mui/icons-material/Portrait';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';

import I18n from '@js/modules/translations';
import PWAManager from '@js/modules/pwaManager';

import {
    userHomePath
} from '@js/constants/routesHelper';


function HeaderUserMenu({
                            userSlug,
                            isNested = false,
                            isAdminConnected = false,
                            onPreferenceClick,
                            onClearPwaCache,
                            onLogoutClick
                        }) {
    const adminContent = (
        <>
            <ListItemButton component="a"
                            className="layout-header-link"
                            href="/admins">
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.administration')}
                </ListItemText>
            </ListItemButton>

            <Divider/>
        </>
    );

    return (
        <List className={classNames({
            'layout-header-nested-menu': isNested
        })}
              component="div"
              disablePadding={isNested}>
            {
                !!isAdminConnected &&
                adminContent
            }

            <ListItemButton component={Link}
                            className="layout-header-link"
                            to={userHomePath(userSlug)}>
                <ListItemIcon>
                    <PortraitIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.profile')}
                </ListItemText>
            </ListItemButton>

            <ListItemButton onClick={onPreferenceClick}>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.settings')}
                </ListItemText>
            </ListItemButton>

            {
                PWAManager.isActive() &&
                <ListItemButton onClick={onClearPwaCache}>
                    <ListItemIcon>
                        <AppShortcutIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: 'layout-header-link'}}>
                        {I18n.t('js.views.header.user.clear_pwa')}
                    </ListItemText>
                </ListItemButton>
            }

            <ListItemButton onClick={onLogoutClick}
                            rel="nofollow">
                <ListItemIcon>
                    <CancelIcon/>
                </ListItemIcon>

                <ListItemText classes={{primary: 'layout-header-link'}}>
                    {I18n.t('js.views.header.user.log_out')}
                </ListItemText>
            </ListItemButton>
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

export default HeaderUserMenu;
