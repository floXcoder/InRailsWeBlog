'use strict';

import {
    signupUser
} from '../../actions';

import SignupForm from './form/signup';

import Modal from '../theme/modal';
import BounceSpinner from '../theme/spinner/bounce';

export default @connect((state) => ({
    isProcessing: state.userState.isProcessing,
    isConnected: state.userState.isConnected
}), {
    signupUser
})
class Signup extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // from connect
        isProcessing: PropTypes.bool,
        isConnected: PropTypes.bool,
        signupUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        values.locale = window.locale;

        this.props.signupUser(values)
            .then((response) => {
                if (response?.errors) {
                    Notification.error(response.errors);
                } else {
                    if (sessionStorage) {
                        sessionStorage.setItem('user-signed', 'true');
                    }

                    if (response?.meta?.location) {
                        window.location.replace(response.meta.location);
                    } else {
                        location.reload(true);
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
                        {I18n.t('js.user.signup.title')}
                    </h1>
                </div>

                <div className="responsive-modal-content">
                    {
                        this.props.isProcessing &&
                        <div className="center-align">
                            <h2>
                                {I18n.t('js.user.signup.connecting')}
                                <BounceSpinner className="margin-bottom-10"/>
                            </h2>
                        </div>
                    }

                    {
                        this.props.isConnected &&
                        <div className="center-align">
                            <h2 className="responsive-modal-subtitle">
                                {I18n.t('js.user.signup.connected')}
                                <BounceSpinner className="margin-bottom-10"/>
                            </h2>
                        </div>
                    }

                    {
                        (!this.props.isProcessing && !this.props.isConnected) &&
                        <SignupForm onSubmit={this._handleSubmit}
                                    onCancel={this.props.onModalChange}/>
                    }
                </div>
            </Modal>
        );
    }
}

