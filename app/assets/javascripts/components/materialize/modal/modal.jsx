'use strict';

const ModalTitle = require('./title');

const classNames = require('classnames');

var Modal = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired,
        launcherId: React.PropTypes.string,
        launcherClass: React.PropTypes.string,
        isBottom: React.PropTypes.bool,
        onOpen: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            launcherId: null,
            launcherClass: null,
            isBottom: false,
            onOpen: null
        };
    },

    componentDidMount () {
        let modalSelector = '#' + this.props.id;
        let launcherSelector = '';
        if(this.props.launcherClass) {
            launcherSelector = '.' + this.props.launcherClass
        } else {
            launcherSelector = '#' + this.props.launcherId;
        }

        $(launcherSelector).click(function (event) {
            event.preventDefault();

            $(modalSelector).openModal({
                dismissible: true,
                ready: () => {
                    if(this.props.onOpen) this.props.onOpen()
                }
            });
        }.bind(this));
    },

    shouldComponentUpdate (nextProps, nextState) {
        // Do not update
        return false;
    },

    render () {
        return (
            <div id={this.props.id}
                 className={classNames('modal', {'bottom-sheet': this.props.isBottom})}>
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

