'use strict';

import '../../../stylesheets/components/accordion.scss';

class AccordionItem extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]).isRequired,
        isOpen: PropTypes.bool.isRequired,
        id: PropTypes.string,
        onHeaderClick: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: this.props.isOpen
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isOpen !== nextProps.isOpen) {
            return {
                ...prevState,
                isOpen: nextProps.isOpen
            };
        }

        return null;
    }

    _handleHeaderClick = (event) => {
        event.preventDefault();

        if (this.state.isOpen) {
            this.setState({
                isOpen: false
            });
        } else {
            this.setState({
                isOpen: true
            });
        }

        if (this.props.onHeaderClick) {
            this.props.onHeaderClick(this.state.isOpen);
        }
    };

    render() {
        const itemClass = classNames(
            'accordion-item',
            {
                open: this.state.isOpen
            }
        );

        return (
            <div id={this.props.id}
                 className={itemClass}>
                <button>
                    toggle
                </button>

                <div className="accordion-item-header"
                     onClick={this._handleHeaderClick}>
                    {this.props.title}
                </div>

                <div className="accordion-item-wrap">
                    <div className="accordion-item-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

function Accordion({
                       title,
                       children,
                       className,
                       id
                   }) {
    return (
        <div id={id}
             className={classNames('accordion', className)}>
            {
                !!title &&
                <h5 className="accordion-title">
                    {title}
                </h5>
            }

            {children}
        </div>
    );
}

Accordion.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]).isRequired,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    id: PropTypes.string,
    className: PropTypes.string
};

export {Accordion, AccordionItem};
