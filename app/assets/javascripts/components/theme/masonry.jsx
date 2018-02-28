'use strict';

import MasonryLoader from '../../loaders/masonry';

// Components must have a "onClick" function to change to exposed mode
// isMasonry property is passed to components if active
const MasonryWrapper = (ComponentCard, componentCardProps, ComponentExposed, componentExposedProps) => class extends React.Component {
    static transitionDuration = 600;
    static columns = {
        1: 12,
        2: 6,
        3: 4,
        4: 3,
        5: 2
    };

    static propTypes = {
        elements: PropTypes.array.isRequired,
        isActive: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        hasColumnButtons: PropTypes.bool,
        hasExposedMode: PropTypes.bool,
        componentsToExposed: PropTypes.array,
        topOffset: PropTypes.number
    };

    static defaultProps = {
        hasColumnButtons: false,
        hasExposedMode: false
    };

    constructor(props) {
        super(props);

        this._masonry = null;

        if (props.isActive) {
            MasonryLoader(({Masonry}) => {
                this.setState({
                    Masonry: Masonry
                });
            });
        }
    }

    state = {
        Masonry: undefined,
        masonryOptions: {
            transitionDuration: `${this.constructor.transitionDuration}ms`,
            itemSelector: '.masonry-grid-item',
            percentPosition: true
        },
        columnPosition: 3,
        exposedComponents: {}
    };

    componentDidMount() {
        if (this.props.isActive && this._masonry) {
            this._masonry.layout();
        }
    }

    // componentDidUpdate() {
    //     if (this.props.isActive && this._masonry) {
    //         this._masonry.layout();
    //     }
    // }

    _handleColumnChange = (value, event) => {
        event.preventDefault();

        let newValue = this.state.columnPosition + value;
        if (newValue > 5) {
            newValue = 5;
        } else if (newValue < 1) {
            newValue = 1;
        }
        this.setState({
            columnPosition: newValue
        });
    };

    _handleComponentClick = (elementId) => {
        if (!this.props.hasExposedMode) {
            return;
        }

        let exposedComponents = this.state.exposedComponents;
        if (exposedComponents[elementId]) {
            delete exposedComponents[elementId];
        } else {
            exposedComponents[elementId] = true;

            setTimeout(() => {
                const {pageYOffset} = window;
                const elementTop = pageYOffset + ReactDOM.findDOMNode(this.refs[elementId]).getBoundingClientRect().top - (this.props.topOffset || 0);
                $('html, body').animate({scrollTop: elementTop}, 600);
            }, this.constructor.transitionDuration);
        }
        this.setState({
            exposedComponents: exposedComponents
        });
    };

    render() {
        let exposedComponents = this.state.exposedComponents;

        const ComponentNodes = this.props.elements.map((element, i) => {
            const itemClasses = classNames(
                'col s12',
                {
                    'l4': !this.props.hasColumnButtons,
                    [`m${this.constructor.columns[this.state.columnPosition]}`]: this.props.hasColumnButtons
                },
                'masonry-grid-item',
                {
                    exposed: this.props.hasExposedMode && exposedComponents[element.id]
                }
            );

            let elementType = {};
            elementType[this.props.type] = element;

            return (
                <div key={`${element.id}-${i}`}
                     ref={element.id}
                     className={itemClasses}>
                    {
                        (this.props.hasExposedMode && exposedComponents[element.id])
                            ?
                            <ComponentExposed isMasonry={true}
                                              {...componentExposedProps}
                                              {...elementType}
                                              onClick={this._handleComponentClick.bind(this, element.id)}/>
                            :
                            <ComponentCard isMasonry={true}
                                           {...componentCardProps}
                                           {...elementType}
                                           onClick={this._handleComponentClick.bind(this, element.id)}/>
                    }
                </div>
            );
        });

        return (
            <div className="masonry row">
                {
                    this.props.hasColumnButtons &&
                    <div className="masonry-buttons">
                        <a className="masonry-button"
                           href="#"
                           onClick={this._handleColumnChange.bind(this, -1)}>
                        <span className="material-icons"
                              data-icon="more_horiz"
                              aria-hidden="true"/>
                        </a>

                        <a className="masonry-button"
                           href="#"
                           onClick={this._handleColumnChange.bind(this, 1)}>
                        <span className="material-icons"
                              data-icon="more_vert"
                              aria-hidden="true"/>
                        </a>
                    </div>
                }

                {
                    this.state.Masonry &&
                    <this.state.Masonry className="masonry-grid"
                                        elementType="div"
                                        options={this.state.masonryOptions}
                                        ref={(c) => this._masonry = c && c.masonry}>
                        {ComponentNodes}
                    </this.state.Masonry>
                }
            </div>
        )
    }
};

export default MasonryWrapper;
