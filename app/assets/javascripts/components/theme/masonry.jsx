'use strict';

import MasonryLoader from '../../loaders/masonry';

// Components must have a "onClick" function to change to exposed mode
// isMasonry property is passed to components if active
const MasonryWrapper = (ComponentCard, componentCardProps, ComponentExposed, componentExposedProps) => class extends React.Component {
    static transitionDuration = 600;

    static propTypes = {
        elements: PropTypes.array.isRequired,
        isActive: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        hasExposedMode: PropTypes.bool,
        componentsToExposed: PropTypes.array,
        topOffset: PropTypes.number
    };

    static defaultProps = {
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
            itemSelector: '.grid-item',
            percentPosition: true
        },
        exposedComponents: {}
    };

    componentDidMount() {
        if (this.props.isActive && this._masonry) {
            this._masonry.layout();
        }
    }

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
                'col s12 m6 l4',
                'grid-item',
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
            <div className="row">
                {
                    this.state.Masonry &&
                    <this.state.Masonry className="grid"
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
