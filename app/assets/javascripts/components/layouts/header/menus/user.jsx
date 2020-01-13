'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PortraitIcon from '@material-ui/icons/Portrait';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    userArticlesPath
} from '../../../../constants/routesHelper';

export default class HeaderUserMenu extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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
                          className={this.props.classes.link}
                          href={'/admins'}>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: this.props.classes.link}}>
                        {I18n.t('js.views.header.user.administration')}
                    </ListItemText>
                </ListItem>
            </>
        );

        return (
            <List className={classNames({
                [this.props.classes.nestedMenu]: this.props.isNested
            })}
                  component="div"
                  disablePadding={this.props.isNested}>
                {
                    this.props.isAdminConnected &&
                    adminContent
                }

                <ListItem button={true}
                          component={Link}
                          className={this.props.classes.link}
                          to={userArticlesPath(this.props.userSlug)}>
                    <ListItemIcon>
                        <PortraitIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: this.props.classes.link}}>
                        {I18n.t('js.views.header.user.profile')}
                    </ListItemText>
                </ListItem>

                <ListItem button={true}
                          onClick={this.props.onPreferenceClick}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: this.props.classes.link}}>
                        {I18n.t('js.views.header.user.settings')}
                    </ListItemText>
                </ListItem>

                <ListItem button={true}
                          onClick={this.props.onLogoutClick}
                          rel="nofollow">
                    <ListItemIcon>
                        <CancelIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: this.props.classes.link}}>
                        {I18n.t('js.views.header.user.log_out')}
                    </ListItemText>
                </ListItem>
            </List>
        );
    }
}
