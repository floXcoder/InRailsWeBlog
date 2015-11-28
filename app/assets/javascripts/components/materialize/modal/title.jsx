'use strict';

var ModalTitle = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired
    },

    render () {
        return (
            <h4 className="modal-title">
                {this.props.children}
            </h4>
        );
    }
});

module.exports = ModalTitle;

