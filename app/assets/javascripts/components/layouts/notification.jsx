'use strict';

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

import theme from '../../theme';

import {
    notificationDuration
} from '../modules/constants';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    alert: InfoIcon
};


class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);

        this._queue = [];
    }

    state = {
        isOpen: false,
        messageInfo: {}
    };

    _handleAdd = (level, message, actionButton, actionCallback) => {
        if (Array.isArray(message)) {
            message = message.join(I18n.t('js.helpers.and'));
        } else if (Utils.is().isObject(message)) {
            let messageText = '';
            Object.keys(message).map((key) => (
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

        this._processQueue();
    };

    _processQueue = () => {
        if (this._queue.length > 0) {
            this.setState({
                messageInfo: this._queue.shift(),
                isOpen: true
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

    success = (message, actionButton, actionCallback) => {
        this._handleAdd('success', message, actionButton, actionCallback);
    };

    alert = (message, actionButton, actionCallback) => {
        this._handleAdd('alert', message, actionButton, actionCallback);
    };

    warn = (message, actionButton, actionCallback) => {
        this._handleAdd('warning', message, actionButton, actionCallback);
    };

    error = (message, actionButton, actionCallback) => {
        this._handleAdd('error', message, actionButton, actionCallback);
    };

    render() {
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

        const Icon = variantIcon[this.state.messageInfo.level || 'info'];
        const className = classNames('notification', 'root', this.state.messageInfo.level || 'info');

        return (
            <StyledEngineProvider injectFirst={true}>
                <ThemeProvider theme={theme}>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={this.state.isOpen}
                        autoHideDuration={notificationDuration}
                        onClose={this._handleClose}
                        TransitionProps={{
                            onExited: this._handleExited
                        }}>
                        {
                            this.state.messageInfo.message &&
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
                        }
                    </Snackbar>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

const Notification = ReactDOM.render(
    <NotificationComponent/>,
    document.getElementById('notification-component')
);

export const success = Notification.success;
export const alert = Notification.alert;
export const warn = Notification.warn;
export const error = Notification.error;
