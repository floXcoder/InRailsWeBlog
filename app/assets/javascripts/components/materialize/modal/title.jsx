'use strict';

const ModalTitle = ({children}) => (
    <h4 className="modal-title center-align">
        {children}
    </h4>
);

ModalTitle.propTypes = {
    children: React.PropTypes.string.isRequired
};

export default ModalTitle;
