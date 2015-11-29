'use strict';

var ModalTitle = require('./title');
//var ModalFooter = require('./footer');

var Modal = React.createClass({
    propTypes: {
        children: React.PropTypes.element.isRequired,
        id: React.PropTypes.string.isRequired,
        buttonId: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        onOpen: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            onOpen: null
        };
    },

    componentDidMount () {
        let modalSelector = '#' + this.props.id;
        let buttonSelector = 'a#' + this.props.buttonId;
        $(buttonSelector).click(function (event) {
            event.preventDefault();

            $(modalSelector).openModal({
                dismissible: true,
                ready: () => { if(this.props.onOpen) this.props.onOpen() }
            });
        }.bind(this));
    },

    render () {
        return (
            <div id={this.props.id}
                 className="modal">
                <div className="modal-content">

                    <ModalTitle>
                        {this.props.title}
                    </ModalTitle>

                    {this.props.children}

                </div>
            </div>
        );
    }
});

module.exports = Modal;

