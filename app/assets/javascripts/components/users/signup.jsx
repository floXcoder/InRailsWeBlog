'use strict';

import Modal from 'react-responsive-modal';

import {
    signupUser
} from '../../actions';

import SignupForm from './form/signup';

import BounceSpinner from '../theme/spinner/bounce';

@connect((state) => ({
    isProcessing: state.userState.isProcessing,
    isConnected: state.userState.isConnected
}), {
    signupUser
})
export default class Signup extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // From connect
        isProcessing: PropTypes.bool,
        isConnected: PropTypes.bool,
        signupUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.signupUser(values.toJS())
            .then(() => {
                if (sessionStorage) {
                    sessionStorage.setItem(`user-connection`, 'true');
                }

                location.reload(true);
            });
    };

    _handleClose = () => {
        if (this.props.isOpened) {
            this.props.onModalChange();
        }
    };

    render() {
        return (
            <Modal open={this.props.isOpened}
                   onClose={this._handleClose}
                   classNames={{modal: 'responsive-modal'}}
                   closeOnEsc={true}
                   closeOnOverlayClick={true}
                   showCloseIcon={false}
                   animationDuration={400}>
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
                            <h2>
                                {I18n.t('js.user.signup.connected')}
                                <BounceSpinner className="margin-bottom-10"/>
                            </h2>
                        </div>
                    }

                    {
                        (!this.props.isProcessing && !this.props.isConnected) &&
                        <SignupForm onCancel={this.props.onModalChange}
                                    onSubmit={this._handleSubmit}/>
                    }
                </div>
            </Modal>
        );
    }
}

