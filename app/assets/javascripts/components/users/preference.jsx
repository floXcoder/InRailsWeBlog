'use strict';

import Modal from '../theme/modal';

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
            <Modal isOpen={this.props.isOpen}
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

