'use strict';

var ModalFooter = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
    },

    render () {
        return (
            <div className="modal-footer">
                <div className="row">
                    <div className="col s12">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ModalFooter;

