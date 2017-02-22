'use strict';

const UserTopic = require('../../users/topic');

import {IconMenu, FlatButton, FontIcon} from 'material-ui';

var HomeTopicHeader = React.createClass({

    getInitialState () {
        return {
            isOpened: false
        };
    },

    _handleOpenMenuClick () {
        this.setState({
            isOpened: !this.state.isOpened
        });
    },

    _handleOnRequestChange (isOpened) {
        this.setState({
            isOpened: isOpened
        });
    },

    render () {
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
                                          onTouchTap={this._handleOpenMenuClick} />
                                  }>
                    <UserTopic onClick={this._handleOpenMenuClick}/>
                </IconMenu>
            );
        } else {
            return null;
        }
    }
});

module.exports = HomeTopicHeader;
