'use strict';

import UserTopic from '../../users/topic';

export default class HomeTopicHeader extends React.PureComponent {
    state = {
        isOpened: false
    };

    constructor(props) {
        super(props);
    }

    _handleOpenMenuClick = () => {
        this.setState({
            isOpened: !this.state.isOpened
        });
    };

    _handleOnRequestChange = (isOpened) => {
        this.setState({
            isOpened: isOpened
        });
    };

    render() {
        if ($app.user.isConnected()) {
            return (
                <div>
                    <div className="btn header-button"
                         href="#"
                         onClick={this._handleOpenMenuClick}>
                        {I18n.t('js.views.header.topic.button')}
                    </div>

                    {/*<UserTopic onClick={this._handleOpenMenuClick}/>*/}
                </div>
            );
        } else {
            return null;
        }
    }
}
