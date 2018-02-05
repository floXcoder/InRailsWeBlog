'use strict';

import ModalTitle from './title';

export default class Modal extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.element
        ]).isRequired,
        launcherId: PropTypes.string,
        launcherClass: PropTypes.string,
        isBottom: PropTypes.bool,
        onOpen: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        isBottom: false
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
                },
                complete: () => {
                    if (this.props.onClose) {
                        this.props.onClose();
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


