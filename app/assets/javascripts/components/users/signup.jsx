'use strict';

import Modal from 'react-responsive-modal';

import {
    signupUser
} from '../../actions';

import SignupForm from './form/signup';

@connect(null, {
    signupUser
})
export default class Signup extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // From connect
        signupUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.signupUser(values.toJS())
        // to get crsf token in meta tag
        // and wait for loading session
            .then(() => setTimeout(() => location.reload(true), 300));
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
                    <SignupForm onCancel={this.props.onModalChange}
                                onSubmit={this._handleSubmit}/>
                </div>
            </Modal>
        );
    }
}

