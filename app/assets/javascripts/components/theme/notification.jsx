'use strict';

import {
    OrderedSet
} from 'immutable';

import {
    NotificationStack
} from 'react-notification';

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        notifications: OrderedSet()
    };

    // Time in seconds
    alert = (message, time = 10, actionButton, actionCallback) => {
        this._add('alert', message, time, actionButton, actionCallback);
    };

    success = (message, time = 10, actionButton, actionCallback) => {
        this._add('success', message, time, actionButton, actionCallback);
    };

    error = (message, time = 15, actionButton, actionCallback) => {
        this._add('error', message, time, actionButton, actionCallback);
    };

    _add = (level, message, time = 10, actionButton, actionCallback) => {
        const key = Utils.uuid();

        return this.setState({
            notifications: this.state.notifications.add({
                message: message,
                key: key,
                action: actionButton,
                className: `notification-${level}`,
                onClick: (deactivate) => {
                    if (typeof deactivate === 'function') {
                        deactivate();
                    }

                    if (typeof actionCallback === 'function') {
                        actionCallback();
                    }

                    setTimeout(() => this.removeNotification(key), 400);
                },
                dismissAfter: time * 1000
            })
        });
    };

    removeNotification = (key) => {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        })
    };

    render() {
        return (
            <div className="notification">
                <NotificationStack notifications={this.state.notifications.toArray()}
                                   onDismiss={notification => this.setState({
                                       notifications: this.state.notifications.delete(notification)
                                   })}/>
            </div>
        );
    }
}

export default ReactDOM.render(
    <Notification/>,
    document.getElementById('notification-component')
);
