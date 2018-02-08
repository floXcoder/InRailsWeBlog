'use strict';

export default class Dropdown extends React.Component {
    static propTypes = {
        button: PropTypes.element.isRequired,
        children: PropTypes.element.isRequired,
        className: PropTypes.string,
        tooltip: PropTypes.string,
        isDefaultOpen: PropTypes.bool,
        isOpened: PropTypes.bool,
        isRightSide: PropTypes.bool
    };

    static defaultProps = {
        isDefaultOpen: false,
        isRightSide: false
    };

    constructor(props) {
        super(props);

        this._isMounted = true
    }

    state = {
        isOpen: this.props.isDefaultOpen
    };

    componentDidMount() {
        document.addEventListener('click', this._handleDocumentClick, false);
        document.addEventListener('touchend', this._handleDocumentClick, false);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpened: nextProps.isOpened
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        document.removeEventListener('click', this._handleDocumentClick, false);
        document.removeEventListener('touchend', this._handleDocumentClick, false);
    }

    _handleDocumentClick = (event) => {
        if (this._isMounted) {
            if (!this.refs.button.contains(event.target)) {
                if (this.state.isOpen) {
                    this.setState({
                        isOpen: false
                    });
                }
            }
        }
    };

    _handleDropdownClick = (event) => {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const hasTooltip = !this.state.isOpen && !!this.props.tooltip;

        return (
            <div className="dropdown-container">
                <div className={classNames(
                    this.props.className,
                    {
                        'tooltip-top': hasTooltip
                    })}
                     data-tooltip={hasTooltip ? this.props.tooltip : undefined}>
                    <a ref="button"
                       className="btn-flat waves-effect waves-matisse dropdown-button"
                       href="#"
                       onClick={this._handleDropdownClick}>
                        {this.props.button}
                    </a>
                </div>

                <div className={classNames('dropdown-slider', {
                    'dropdown-slider-right': this.props.isRightSide,
                    'dropdown-slider-open': this.state.isOpen
                })}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}


