'use strict';

class AccordionItem extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ]).isRequired,
        isOpen: React.PropTypes.bool.isRequired,
        id: React.PropTypes.string,
        onHeaderClicked: React.PropTypes.func
    };

    static defaultProps = {
        id: null,
        isOpen: true,
        onHeaderClicked: null
    };

    state = {
        isOpen: this.props.isOpen
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpen: nextProps.isOpen
        });
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

        if (this.props.onHeaderClicked && !this.state.isOpen) {
            this.props.onHeaderClicked();
        }
    };

    render() {
        let itemClass = classNames(
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

const Accordion = ({title, children, className, id}) => (
    <div id={id}
         className={classNames('accordion', className)}>
        {
            title &&
            <h5 className="accordion-title">
                {title}
            </h5>
        }

        {children}
    </div>
);

Accordion.propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
    title: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ]),
    id: React.PropTypes.string,
    className: React.PropTypes.string
};

Accordion.defaultProps = {
    title: null,
    id: null,
    className: null
};

export {Accordion, AccordionItem};
