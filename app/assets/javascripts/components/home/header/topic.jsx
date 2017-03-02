'use strict';

import UserTopic from '../../users/topic';

import {IconMenu, FlatButton, FontIcon} from 'material-ui';

export default class HomeTopicHeader extends React.PureComponent {
    state = {
        isOpened: false
    };

    constructor(props) {
        super(props);
    }

    _handleOpenMenuClick() {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    _handleOnRequestChange(isOpened) {
        this.setState({
            isOpened: isOpened
        });
    }

    render() {
        if ($app.user.isConnected()) {
            return (
                <IconMenu anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                          open={this.state.isOpened}
                          onRequestChange={this._handleOnRequestChange}
                          iconButtonElement={
                              <FlatButton label={I18n.t('js.header.topic.button')}
                                          className="header-button"
                                          secondary={true}
                                          icon={<FontIcon className="material-icons">dashboard</FontIcon>}
                                          onTouchTap={this._handleOpenMenuClick}/>
                          }>
                    <UserTopic onClick={this._handleOpenMenuClick}/>
                </IconMenu>
            );
        } else {
            return null;
        }
    }
}
