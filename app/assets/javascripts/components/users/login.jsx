'use strict';

import {
    loginUser
} from '../../actions';

import LoginForm from './form/login';

import Modal from '../theme/modal';
import BounceSpinner from '../theme/spinner/bounce';

export default @connect((state) => ({
    isProcessing: state.userState.isProcessing,
    isConnected: state.userState.isConnected
}), {
    loginUser
})
class Login extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // from connect
        isProcessing: PropTypes.bool,
        isConnected: PropTypes.bool,
        loginUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.loginUser(values)
            .then((response) => {
                if (response?.errors) {
                    Notification.error(response.errors);
                    window.location.replace('/');
                } else if (response.user) {
                    if (response?.meta?.location) {
                        window.location.replace(response.meta.location);
                    } else {
                        document.location.reload(true);
                    }
                }
            });
    };

    _handleClose = () => {
        if (this.props.isOpen) {
            this.props.onModalChange();
        }
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpen}
                   onClose={this._handleClose}>
                <div className="responsive-modal-title">
                    <h1>
                        {I18n.t('js.user.login.title')}
                    </h1>
                </div>

                <div className="responsive-modal-content">
                    {
                        this.props.isProcessing &&
                        <div className="center-align">
                            <h2 className="responsive-modal-subtitle">
                                {I18n.t('js.user.login.connecting')}
                                <BounceSpinner className="margin-bottom-10"/>
                            </h2>
                        </div>
                    }

                    {
                        this.props.isConnected &&
                        <div className="center-align">
                            <h2 className="responsive-modal-subtitle">
                                {I18n.t('js.user.login.connected')}
                                <BounceSpinner className="margin-bottom-10"/>
                            </h2>
                        </div>
                    }

                    {
                        (!this.props.isProcessing && !this.props.isConnected) &&
                        <LoginForm onSubmit={this._handleSubmit}
                                   onCancel={this.props.onModalChange}/>
                    }
                </div>
            </Modal>
        );
    }
}

