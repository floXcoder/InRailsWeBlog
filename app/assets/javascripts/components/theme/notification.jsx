'use strict';

const NotificationStack = require('react-notification').NotificationStack;
const OrderedSet = require('immutable').OrderedSet;

class Notification extends React.Component {
    state = {
        notifications: OrderedSet()
    };

    constructor(props) {
        super(props);
    }

    alert = (message, time = 5, actionButton, actionCallback) => {
        this._add('alert', message, time, actionButton, actionCallback);
    };

    success = (message, time = 5, actionButton, actionCallback) => {
        this._add('success', message, time, actionButton, actionCallback);
    };

    error = (message, time = 5, actionButton, actionCallback) => {
        this._add('error', message, time, actionButton, actionCallback);
    };

    _add = (level, message, time = 5, actionButton, actionCallback) => {
        const key = $.uuid();

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
    <Notification />,
    document.getElementById('notification-component')
);
