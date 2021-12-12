'use strict';

import IconButton from '@material-ui/core/IconButton';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Dropdown from '../../theme/dropdown';

import HeaderUserMenu from './menus/user';


export default class HomeUserHeader extends React.PureComponent {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        onLogoutClick: PropTypes.func.isRequired,
        onPreferenceClick: PropTypes.func.isRequired,
        isAdminConnected: PropTypes.bool
    };

    render() {
        return (
            <Dropdown button={
                <IconButton color="default"
                            itemProp="url">
                    <AccountCircleIcon/>
                </IconButton>
            }
                      position="bottom right"
                      buttonClassName="layout-header-headerButton"
                      isFixed={true}
                      hasWavesEffect={false}
                      hasArrow={true}>
                <HeaderUserMenu isAdminConnected={this.props.isAdminConnected}
                                userSlug={this.props.userSlug}
                                onPreferenceClick={this.props.onPreferenceClick}
                                onLogoutClick={this.props.onLogoutClick}/>
            </Dropdown>
        );
    }
}
