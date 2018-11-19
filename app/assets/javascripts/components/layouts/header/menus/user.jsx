'use strict';

import {Link} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PortraitIcon from '@material-ui/icons/Portrait';
import CancelIcon from '@material-ui/icons/Cancel';
import SettingsIcon from '@material-ui/icons/Settings';

export default class HeaderUserMenu extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        userSlug: PropTypes.string.isRequired,
        onPreferenceClick: PropTypes.func.isRequired,
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
                          component={Link}
                          to={`/admin`}>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>

                    <ListItemText className={this.props.classes.link}>
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
                <ListItem button={true}
                          component={Link}
                          className={this.props.classes.link}
                          to={`/users/${this.props.userSlug}`}>
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
                          component="a"
                          href="/api/v1/logout"
                          data-method="delete"
                          rel="nofollow">
                    <ListItemIcon>
                        <CancelIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: this.props.classes.link}}>
                        {I18n.t('js.views.header.user.log_out')}
                    </ListItemText>
                </ListItem>

                {
                    this.props.isAdminConnected &&
                    adminContent
                }
            </List>
        );
    }
}
