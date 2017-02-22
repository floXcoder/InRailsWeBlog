'use strict';

const ModalTitle = ({ children }) => (
    <h4 className="modal-title">
        {children}
    </h4>
);

ModalTitle.propTypes = {
    children: React.PropTypes.string.isRequired
};

module.exports = ModalTitle;

