import React from 'react';
import PropTypes from 'prop-types';

import I18n from '@js/modules/translations';

import Modal from '@js/components/theme/modal';

import UserSettings from '@js/components/users/settings';


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

