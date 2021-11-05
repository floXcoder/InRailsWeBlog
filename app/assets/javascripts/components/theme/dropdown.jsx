'use strict';

import Portal from '../modules/portal';

import '../../../stylesheets/components/dropdown.scss';

export const POSITIONS = [
    'top left',
    'top right',
    'bottom right',
    'bottom left',
    'right center',
    'left center',
    'top center',
    'bottom center',
];

export default class Dropdown extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        isButton: PropTypes.bool,
        button: PropTypes.element,
        position: PropTypes.oneOf(POSITIONS),
        className: PropTypes.string,
        hasArrow: PropTypes.bool,
        tooltip: PropTypes.string,
        isDefaultOpen: PropTypes.bool,
        isForceOpen: PropTypes.bool,
        isFixed: PropTypes.bool,
        buttonClassName: PropTypes.string,
        isClosingOnInsideClick: PropTypes.bool,
        isFloatingButton: PropTypes.bool,
        isHidingOnScroll: PropTypes.bool,
        horizontalOffset: PropTypes.number,
        verticalOffset: PropTypes.number,
        onClose: PropTypes.func
    };

    static defaultProps = {
        isButton: true,
        position: 'bottom center',
        hasArrow: false,
        isFixed: false,
        isDefaultOpen: false,
        isFloatingButton: false,
        isClosingOnInsideClick: true,
        isHidingOnScroll: true
    };

    constructor(props) {
        super(props);

        this._isMounted = true;
        this._buttonRef = null;
        this._popupRef = null;
        this._popupCoords = null;

        this._dropdownTimeout = null;
    }

    state = {
        isOpen: this.props.isDefaultOpen,
        style: undefined,
        position: this.props.position
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (typeof nextProps.isForceOpen !== 'undefined') {
            return {
                ...prevState,
                isOpen: nextProps.isForceOpen
            };
        }

        return null;
    }

    componentDidMount() {
        document.addEventListener('click', this._handleDocumentClick, false);
        document.addEventListener('touchend', this._handleDocumentClick, false);
        document.addEventListener('keydown', this._handleEscapeClick, false);
        if (this.props.isHidingOnScroll) {
            window.addEventListener('scroll', this._handleScroll, false);
        }

        // Ensure child is mounted
        this._dropdownTimeout = setTimeout(() => this._setPopupStyle(), 300);
    }

    componentWillUnmount() {
        this._isMounted = false;

        document.removeEventListener('click', this._handleDocumentClick, false);
        document.removeEventListener('touchend', this._handleDocumentClick, false);
        document.removeEventListener('keydown', this._handleEscapeClick, false);
        if (this.props.isHidingOnScroll) {
            window.removeEventListener('scroll', this._handleScroll, false);
        }

        if (this._dropdownTimeout) {
            clearTimeout(this._dropdownTimeout);
        }
    }

    _computePopupStyle = (positions) => {
        const style = {
            position: this.props.isFixed ? 'fixed' : 'absolute'
        };

        const {horizontalOffset, verticalOffset} = this.props;
        const {pageYOffset, pageXOffset} = window;
        const {clientWidth, clientHeight} = document.documentElement;

        if (positions.includes('right')) {
            style.right = Math.round(clientWidth - (this._buttonCoords.right + pageXOffset));
            style.left = 'auto';
        } else if (positions.includes('left')) {
            style.left = Math.round(this._buttonCoords.left + pageXOffset);
            style.right = 'auto';
        } else {
            // if not left nor right, we are horizontally centering the element
            const xOffset = (this._buttonCoords.width - this._popupCoords.width) / 2;
            style.left = Math.round(this._buttonCoords.left + xOffset + pageXOffset);
            style.right = 'auto';
        }

        if (positions.includes('top')) {
            style.bottom = Math.round(clientHeight - (this._buttonCoords.top + pageYOffset));
            style.top = 'auto';
        } else if (positions.includes('bottom')) {
            style.top = Math.round(this._buttonCoords.bottom + pageYOffset);
            style.bottom = 'auto';
        } else {
            // if not top nor bottom, we are vertically centering the element
            const yOffset = (this._buttonCoords.height + this._popupCoords.height) / 2;
            style.top = Math.round((this._buttonCoords.bottom + pageYOffset) - yOffset);
            style.bottom = 'auto';

            const xOffset = this._popupCoords.width;
            if (positions.includes('right')) {
                style.right -= xOffset;
            } else {
                style.left -= xOffset;
            }
        }

        if (horizontalOffset) {
            if (Utils.isNumber(style.right)) {
                style.right -= horizontalOffset;
            } else {
                style.left -= horizontalOffset;
            }
        }

        if (verticalOffset) {
            if (Utils.isNumber(style.top)) {
                style.top += verticalOffset;
            } else {
                style.bottom += verticalOffset;
            }
        }

        return style;
    };

    // check if the style would display the popup outside of the view port
    _isStyleInViewport = (style) => {
        const {pageYOffset, pageXOffset} = window;
        const {clientWidth, clientHeight} = document.documentElement;

        const element = {
            top: style.top,
            left: style.left,
            width: this._popupCoords.width,
            height: this._popupCoords.height,
        };

        if (Utils.isNumber(style.right)) {
            element.left = clientWidth - style.right - element.width;
        }
        if (Utils.isNumber(style.bottom)) {
            element.top = clientHeight - style.bottom - element.height;
        }

        // hidden on top
        if (element.top < pageYOffset) {
            return false;
        }
        // hidden on the bottom
        if (element.top + element.height > pageYOffset + clientHeight) {
            return false;
        }
        // hidden the left
        if (element.left < pageXOffset) {
            return false;
        }
        // hidden on the right
        if (element.left + element.width > pageXOffset + clientWidth) {
            return false;
        }

        return true;
    };

    _setPopupStyle = () => {
        this._buttonCoords = this._buttonRef ? this._buttonRef.getBoundingClientRect() : null;
        this._popupCoords = this._popupRef ? this._popupRef.getBoundingClientRect() : null;

        if (!this._buttonCoords || !this._popupCoords) {
            return;
        }

        let position = this.props.position;
        let style = this._computePopupStyle(position);

        // Lets detect if the popup is out of the viewport and adjust the position accordingly
        const positions = POSITIONS.remove(position).concat([position]);
        for (let i = 0; !this._isStyleInViewport(style) && i < positions.length; i += 1) {
            style = this._computePopupStyle(positions[i]);
            position = positions[i];
        }

        // Append 'px' to every numerical values in the style
        style = Utils.mapValues(style, (value) => (Utils.isNumber(value) ? `${value}px` : value));

        this.setState({
            style,
            position
        });
    };

    _handleScroll = (event) => {
        if (this.state.isOpen) {
            if (this.props.onClose) {
                this.props.onClose(event);
            }

            this.setState({
                isOpen: false
            });
        }
    };

    _handleEscapeClick = (event) => {
        if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
            if (this.state.isOpen) {
                if (this.props.onClose) {
                    this.props.onClose(event);
                }

                this.setState({
                    isOpen: false
                });
            }
        }
    };

    _handleDocumentClick = (event) => {
        if (this._isMounted && this._buttonRef) {
            if (!this.props.isClosingOnInsideClick && this._popupRef.contains(event.target)) {
                return;
            }

            if (!this._buttonRef.contains(event.target)) {
                if (this.state.isOpen) {
                    if (this.props.onClose) {
                        this.props.onClose(event);
                    }

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
            <>
                <div className={classNames(
                    this.props.className,
                    {
                        'flow-tooltip-top': hasTooltip
                    }
                )}
                     data-tooltip={hasTooltip ? this.props.tooltip : undefined}>
                    {
                        this.props.isButton
                            ?
                            <a className={classNames(this.props.buttonClassName, {
                                'btn-floating': this.props.isFloatingButton,
                            })}
                               ref={(buttonRef) => this._buttonRef = buttonRef}
                               href="#"
                               onClick={this._handleDropdownClick}>
                                {this.props.button}
                            </a>
                            :
                            <div ref={(buttonRef) => this._buttonRef = buttonRef}>
                                {this.props.button}
                            </div>
                    }
                </div>

                <Portal domNode="dropdown-component">
                    <div ref={(contentRef) => this._popupRef = contentRef}
                         style={this.state.style}
                         className={classNames(this.state.position, 'dropdown-slider', {
                             'dropdown-slider-open': this.state.isOpen,
                             'dropdown-slider-arrow': this.props.hasArrow,
                             'dropdown-slider-no-arrow': !this.props.hasArrow
                         })}>
                        {this.props.children}
                    </div>
                </Portal>
            </>
        );
    }
}


