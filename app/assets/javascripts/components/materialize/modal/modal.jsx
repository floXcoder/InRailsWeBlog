'use strict';

import ModalTitle from './title';

export default class Modal extends React.Component {
    static propTypes = {
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
    };

    static defaultProps = {
        launcherId: null,
        launcherClass: null,
        isBottom: false,
        onOpen: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const modalSelector = '#' + this.props.id;
        let launcherSelector = '';
        if (this.props.launcherClass) {
            launcherSelector = '.' + this.props.launcherClass
        } else {
            launcherSelector = '#' + this.props.launcherId;
        }
        const $modalSelector = $(modalSelector);
        const $launcherSelector = $(launcherSelector);

        $modalSelector.modal({
                dismissible: true,
                ready: () => {
                    if (this.props.onOpen) {
                        this.props.onOpen();
                    }
                }
            }
        );

        $launcherSelector.click((event) => {
            event.preventDefault();

            $modalSelector.modal('open');
        });
    }

    render() {
        return (
            <div id={this.props.id}
                 className={classNames('modal', {'bottom-sheet': this.props.isBottom})}>
                <div className="modal-content container">
                    <ModalTitle>
                        {this.props.title}
                    </ModalTitle>

                    {this.props.children}
                </div>
            </div>
        );
    }
}


