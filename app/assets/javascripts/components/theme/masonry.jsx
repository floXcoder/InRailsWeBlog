'use strict';

import '../../../stylesheets/components/masonry.scss';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import MasonryLoader from '../../loaders/masonry';

const transitionDuration = 600;
const columns = {
    1: 12,
    2: 6,
    3: 4,
    4: 3,
    5: 2
};

// Components must have a "onClick" function to change to exposed mode
// isMasonry property is passed to components if active
const MasonryWrapper = (ComponentCard, componentCardProps, ComponentExposed, componentExposedProps) => class extends React.Component {
    static propTypes = {
        elements: PropTypes.array.isRequired,
        isActive: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        hasColumnButtons: PropTypes.bool,
        columnCount: PropTypes.number,
        hasExposedMode: PropTypes.bool,
        componentsToExposed: PropTypes.array,
        topOffset: PropTypes.number,
        onComponentEnter: PropTypes.func,
        onComponentExit: PropTypes.func
    };

    static defaultProps = {
        hasColumnButtons: false,
        columnCount: 2,
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
            transitionDuration: `${transitionDuration}ms`,
            itemSelector: '.masonry-grid-item',
            percentPosition: true
        },
        columnPosition: this.props.columnCount,
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
            }, transitionDuration);
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
                    'l4': !this.props.columnCount,
                    [`m${columns[this.state.columnPosition]}`]: this.props.columnCount
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
                                              onEnter={this.props.onComponentEnter}
                                              onExit={this.props.onComponentExit}
                                              onClick={this._handleComponentClick.bind(this, element.id)}/>
                            :
                            <ComponentCard isMasonry={true}
                                           {...componentCardProps}
                                           {...elementType}
                                           onEnter={this.props.onComponentEnter}
                                           onExit={this.props.onComponentExit}
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
                        <Tooltip title={I18n.t('js.article.masonry.remove_column')}>
                            <IconButton aria-label="Delete"
                                        className="masonry-button"
                                        onClick={this._handleColumnChange.bind(this, -1)}>
                                <RemoveIcon/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={I18n.t('js.article.masonry.add_column')}>
                            <IconButton aria-label="Delete"
                                        className="masonry-button"
                                        onClick={this._handleColumnChange.bind(this, 1)}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                }

                {
                    this.state.Masonry &&
                    <this.state.Masonry className="masonry-grid"
                                        elementType="div"
                                        options={this.state.masonryOptions}
                                        ref={(ref) => this._masonry = ref && ref.masonry}>
                        {ComponentNodes}
                    </this.state.Masonry>
                }
            </div>
        )
    }
};

export default MasonryWrapper;
