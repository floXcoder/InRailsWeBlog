'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PortraitIcon from '@material-ui/icons/Portrait';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    userHomePath
} from '../../../../constants/routesHelper';


export default class HeaderUserMenu extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        onPreferenceClick: PropTypes.func.isRequired,
        onLogoutClick: PropTypes.func.isRequired,
        isNested: PropTypes.bool,
        isAdminConnected: PropTypes.bool
    };

    static defaultProps = {
        isNested: false,
        isAdminConnected: false
    };

    render() {
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
                'layout-header-nestedMenu': this.props.isNested
            })}
                  component="div"
                  disablePadding={this.props.isNested}>
                {
                    this.props.isAdminConnected &&
                    adminContent
                }

                <ListItem button={true}
                          component={Link}
                          className="layout-header-link"
                          to={userHomePath(this.props.userSlug)}>
                    <ListItemIcon>
                        <PortraitIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: 'layout-header-link'}}>
                        {I18n.t('js.views.header.user.profile')}
                    </ListItemText>
                </ListItem>

                <ListItem button={true}
                          onClick={this.props.onPreferenceClick}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: 'layout-header-link'}}>
                        {I18n.t('js.views.header.user.settings')}
                    </ListItemText>
                </ListItem>

                <ListItem button={true}
                          onClick={this.props.onLogoutClick}
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
}
