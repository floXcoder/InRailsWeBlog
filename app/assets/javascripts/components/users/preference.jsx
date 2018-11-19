'use strict';

import Modal from 'react-responsive-modal';

import UserSettings from './settings';

export default class UserPreference extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleClose = () => {
        if (this.props.isOpen) {
            this.props.onModalChange();
        }
    };

    render() {
        return (
            <Modal open={this.props.isOpen}
                   classNames={{
                       overlay: 'responsive-modal-overlay',
                       modal: 'responsive-modal'
                   }}
                   center={true}
                   closeOnEsc={true}
                   closeOnOverlayClick={true}
                   showCloseIcon={false}
                   animationDuration={400}
                   onClose={this._handleClose}>
                <div className="responsive-modal-title">
                    <h1>
                        {I18n.t('js.views.header.user.settings')}
                    </h1>
                </div>

                <div className="responsive-modal-content">
                    <UserSettings/>
                </div>
            </Modal>
        );
    }
}

