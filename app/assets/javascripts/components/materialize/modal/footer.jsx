'use strict';

const ModalFooter = ({children}) => (
    <div className="modal-footer">
        <div className="row">
            <div className="col s12">
                {children}
            </div>
        </div>
    </div>
);

ModalFooter.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
        PropTypes.object
    ]).isRequired
};

export default ModalFooter;
