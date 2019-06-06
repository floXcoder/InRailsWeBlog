'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Dropdown from '../../theme/dropdown';

import HeaderUserMenu from './menus/user';

import styles from '../../../../jss/user/header';

export default @withStyles(styles)
class HomeUserHeader extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        onLogoutClick: PropTypes.func.isRequired,
        onPreferenceClick: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <Dropdown button={
                <IconButton color="primary">
                    <AccountCircleIcon/>
                </IconButton>
            }
                      position="bottom right"
                      buttonClassName="header-button"
                      isFixed={true}
                      hasWavesEffect={false}
                      hasArrow={true}>
                <HeaderUserMenu classes={this.props.classes}
                                userSlug={this.props.userSlug}
                                onPreferenceClick={this.props.onPreferenceClick}
                                onLogoutClick={this.props.onLogoutClick}/>
            </Dropdown>
        );
    }
}
