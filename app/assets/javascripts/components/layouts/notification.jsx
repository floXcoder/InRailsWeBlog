'use strict';

import {
    MuiThemeProvider,
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

import theme from '../../../jss/theme';
import styles from '../../../jss/notification';

import {
    notificationDuration
} from '../modules/constants';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    alert: InfoIcon
};

@withStyles(styles)
class NotificationContent extends React.Component {
    static propTypes = {
        messageInfo: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    render() {
        const actions = [
            <IconButton key="close"
                        aria-label="Close"
                        color="inherit"
                        className={this.props.classes.close}
                        onClick={this.props.onClose}>
                <CloseIcon/>
            </IconButton>
        ];

        if (this.props.messageInfo.actionButton) {
            actions.unshift(
                <Button key="undo"
                        color="secondary"
                        size="small"
                        onClick={this.props.messageInfo.actionCallback}>
                    {this.props.messageInfo.actionButton}
                </Button>
            );
        }

        const Icon = variantIcon[this.props.messageInfo.level || 'info'];
        const className = this.props.classes[this.props.messageInfo.level || 'info'];

        return (
            <SnackbarContent
                className={className}
                aria-describedby="message-notification"
                message={
                    <span id="message-notification"
                          className={this.props.classes.message}>
                        <Icon className={classNames(this.props.classes.icon, this.props.classes.iconVariant)}/>
                        {this.props.messageInfo.message}
                    </span>
                }
                action={actions}/>
        );
    }
}

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
        return (
            <MuiThemeProvider theme={theme}>
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                          open={this.state.isOpen}
                          autoHideDuration={notificationDuration}
                          onClose={this._handleClose}
                          onExited={this._handleExited}>
                    <NotificationContent messageInfo={this.state.messageInfo}
                                         onClose={this._handleClose}/>
                </Snackbar>
            </MuiThemeProvider>
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
