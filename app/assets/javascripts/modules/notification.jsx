import React from 'react';
import {createRoot} from 'react-dom/client';

import classNames from 'classnames';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

import I18n from '@js/modules/translations.js';
import * as Utils from '@js/modules/utils.js';

import theme from '@js/theme.jsx';

import {
    notificationDuration
} from '@js/components/modules/constants.js';

const variantIcon = {
    success: CheckCircleIcon,
    alert: InfoIcon,
    warn: WarningIcon,
    error: ErrorIcon
};

const Notification = {};


class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);

        this._queue = [];

        ['success', 'alert', 'warn', 'error'].forEach((type) => {
            Notification[type] = (message, duration, actionButton, actionCallback) => {
                this._handleAdd(type, message, duration, actionButton, actionCallback);
            };
        });

        Notification.initialize = this._checkInitialNotification;
    }

    state = {
        isOpen: false,
        notificationDuration: notificationDuration,
        messageInfo: {}
    };

    _checkInitialNotification = () => {
        const flashes = document.querySelectorAll('.blog-flash');

        Array.prototype.forEach.call(flashes, function (element) {
            const level = element.getAttribute('data-level');
            const token = element.getAttribute('data-flash-token');

            if (sessionStorage) {
                // Do not display same flash message twice
                if (sessionStorage.getItem(`flash-message-${token}`)) {
                    return;
                }
            }

            // Let's the Notification component initialize
            document.addEventListener('DOMContentLoaded', function () {
                setTimeout(function () {
                    if (level === 'success') {
                        Notification.success(element.innerHTML);
                    } else if (level === 'error') {
                        Notification.error(element.innerHTML);
                    } else {
                        Notification.info(element.innerHTML);
                    }
                }, 200);
            });

            if (sessionStorage) {
                sessionStorage.setItem(`flash-message-${token}`, 'true');
            }
        });
    };

    _handleAdd = (level, message, duration, actionButton, actionCallback) => {
        if (Array.isArray(message)) {
            message = message.join(I18n.t('js.helpers.and'));
        } else if (Utils.is()
            .isObject(message)) {
            let messageText = '';
            Object.keys(message)
                .map((key) => (
                    messageText += Array.isArray(message[key]) ? key + ' ' + message[key].join(I18n.t('js.helpers.and')) : key + ' ' + message[key]
                ));
            message = messageText;
        }

        this._queue.push({
            key: Utils.uuid(),
            level,
            message,
            actionButton,
            actionCallback
        });

        // if (this.state.isOpen) {
        //     // immediately begin dismissing current message to start showing new one
        //     this.setState({isOpen: false});
        // } else {
        //     this._processQueue();
        // }

        this._processQueue(duration);
    };

    _processQueue = (duration) => {
        if (this._queue.length > 0) {
            this.setState({
                messageInfo: this._queue.shift(),
                isOpen: true,
                notificationDuration: duration || notificationDuration
            });
        }
    };

    _handleClose = () => {
        // if (reason === 'clickaway') {
        //     return;
        // }

        this.setState({isOpen: false});
    };

    _handleExited = () => {
        this._processQueue();
    };

    render() {
        if (Utils.isEmpty(this.state.messageInfo)) {
            return null;
        }

        const actions = [
            <IconButton key="close"
                        aria-label="Close"
                        color="inherit"
                        className="close"
                        onClick={this._handleClose}
                        size="large">
                <CloseIcon/>
            </IconButton>
        ];

        if (this.state.messageInfo.actionButton) {
            actions.unshift(
                <Button key="undo"
                        color="secondary"
                        size="small"
                        onClick={this.state.messageInfo.actionCallback}>
                    {this.state.messageInfo.actionButton}
                </Button>
            );
        }

        const Icon = variantIcon[this.state.messageInfo.level || 'alert'];
        const className = classNames('notification', 'root', this.state.messageInfo.level || 'alert');

        return (
            <StyledEngineProvider injectFirst={true}>
                <ThemeProvider theme={theme}>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={this.state.isOpen}
                        autoHideDuration={this.state.notificationDuration}
                        onClose={this._handleClose}
                        TransitionProps={{
                            onExited: this._handleExited
                        }}>
                        <SnackbarContent className={className}
                                         aria-describedby="message-notification"
                                         message={
                                             <span id="message-notification"
                                                   className="message">
                                                 <Icon className="icon icon-variant"/>
                                                 {this.state.messageInfo.message || null}
                                             </span>
                                         }
                                         action={actions}/>
                    </Snackbar>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

const root = createRoot(document.getElementById('notification-component'));
root.render(
    <NotificationComponent/>
);

export default Notification;
