'use strict';

import '../../../stylesheets/components/modal.scss';

import ResponsiveModal from 'react-responsive-modal';

const Modal = ({isOpen, onClose, children}) => (
    <ResponsiveModal open={isOpen}
                     classNames={{
                         overlay: 'responsive-modal-overlay',
                         modal: 'responsive-modal'
                     }}
                     center={true}
                     closeOnEsc={true}
                     closeOnOverlayClick={true}
                     showCloseIcon={false}
                     animationDuration={400}
                     onClose={onClose}>
        {children}
    </ResponsiveModal>
);

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array
    ]).isRequired,
};

export default React.memo(Modal);
