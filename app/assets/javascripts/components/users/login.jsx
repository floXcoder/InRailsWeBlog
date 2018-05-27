'use strict';

import Modal from 'react-responsive-modal';

import {
    loginUser
} from '../../actions';

import LoginForm from './form/login';

import BounceSpinner from '../theme/spinner/bounce';

@connect((state) => ({
    isProcessing: state.userState.isProcessing
}), {
    loginUser
})
export default class Login extends React.PureComponent {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // From connect
        isProcessing: PropTypes.bool,
        loginUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.loginUser(values.toJS())
            .then(() => location.reload(true));
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
                        {I18n.t('js.user.login.title')}
                    </h1>
                </div>

                <div className="responsive-modal-content">
                    {
                        this.props.isProcessing
                            ?
                            <div className="center-align">
                                <h2>
                                    {I18n.t('js.user.login.connecting')}
                                    <BounceSpinner className="margin-bottom-10"/>
                                </h2>
                            </div>
                            :
                            <LoginForm onCancel={this.props.onModalChange}
                                       onSubmit={this._handleSubmit}/>
                    }
                </div>
            </Modal>
        );
    }
}

