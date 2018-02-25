'use strict';

import Modal from 'react-responsive-modal';

import UserSettings from './settings';

export default class UserPreference extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

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
                        {I18n.t('js.views.header.user.settings')}
                    </h1>
                </div>

                <div className="responsive-modal-content user-preference-modal">
                    <UserSettings/>
                </div>
            </Modal>
        );
    }
}

