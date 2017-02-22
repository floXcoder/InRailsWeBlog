'use strict';

const ModalFooter = ({ children }) => (
    <div className="modal-footer">
        <div className="row">
            <div className="col s12">
                {children}
            </div>
        </div>
    </div>
);

ModalFooter.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.element),
        React.PropTypes.element,
        React.PropTypes.object
    ]).isRequired
};

module.exports = ModalFooter;

