import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import I18n from '@js/modules/translations';

import {
    hasLocalStorage,
    saveLocalData,
    getLocalData
} from '@js/middlewares/localStorage';

import MasonryLoader from '@js/loaders/masonry';

import '@css/components/masonry.scss';

const TRANSITION_DURATION = 600;
const COLUMNS = {
    1: 12,
    2: 6,
    3: 4,
    4: 3,
    5: 2
};

// Components must have a "onClick" function to change to exposed mode
// isMasonry property is passed to components if active
const MasonryWrapper = (ComponentCard, componentCardProps, ComponentExposed, componentExposedProps) => (class extends React.Component {
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

        this._masonryWrapperRef = React.createRef();
        this._masonryComponentRef = React.createRef();

        this._masonryTimeout = null;

        if (props.isActive) {
            MasonryLoader(({Masonry}) => {
                this.setState({
                    Masonry: Masonry
                });
            });
        }

        const localMasonry = getLocalData('masonry');
        if (localMasonry?.columnCount) {
            this.state.columnCount = localMasonry.columnCount;
        }
    }

    state = {
        Masonry: undefined,
        masonryOptions: {
            transitionDuration: `${TRANSITION_DURATION}ms`,
            itemSelector: '.masonry-grid-item',
            percentPosition: true
        },
        columnCount: this.props.columnCount,
        exposedComponents: {}
    };

    componentDidMount() {
        if (this.props.isActive && this._masonryComponentRef?.current) {
            this._masonryComponentRef.current.layout();
        }
    }

    componentWillUnmount() {
        if (this._masonryTimeout) {
            clearTimeout(this._masonryTimeout);
        }
    }

    // componentDidUpdate() {
    //     if (this.props.isActive && this._masonryComponentRef?.current) {
    //         this._masonryComponentRef.current.layout();
    //     }
    // }

    _handleColumnChange = (value, event) => {
        event.preventDefault();

        let nbColumns = this.state.columnCount + value;
        if (nbColumns > 5) {
            nbColumns = 5;
        } else if (nbColumns < 1) {
            nbColumns = 1;
        }

        if (hasLocalStorage) {
            saveLocalData('masonry', {columnCount: nbColumns});
        }

        this.setState({
            columnCount: nbColumns
        });
    };

    _handleComponentClick = (elementId) => {
        if (!this.props.hasExposedMode) {
            return;
        }

        const exposedComponents = this.state.exposedComponents;
        if (exposedComponents[elementId]) {
            delete exposedComponents[elementId];
        } else {
            exposedComponents[elementId] = true;

            this._masonryTimeout = setTimeout(() => {
                const {
                    pageYOffset
                } = window;
                const masonryWrapperNode = this._masonryWrapperRef.current;
                const elementTop = pageYOffset + masonryWrapperNode.getBoundingClientRect().top - (this.props.topOffset || 0);

                window.scroll({
                    top: elementTop,
                    behavior: 'smooth'
                });
            }, TRANSITION_DURATION);
        }
        this.setState({
            exposedComponents: exposedComponents
        });
    };

    render() {
        const exposedComponents = this.state.exposedComponents;

        const ComponentNodes = this.props.elements.map((element, i) => {
            const itemClasses = classNames(
                'col s12',
                {
                    l4: !this.props.columnCount,
                    [`m${COLUMNS[this.state.columnCount]}`]: this.props.columnCount
                },
                'masonry-grid-item',
                {
                    exposed: this.props.hasExposedMode && exposedComponents[element.id]
                }
            );

            const elementType = {
                [this.props.type]: element
            };

            return (
                <div key={`${element.id}-${i}`}
                     ref={this._masonryWrapperRef}
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
                    !!this.props.hasColumnButtons &&
                    <div className="masonry-buttons">
                        <Tooltip title={I18n.t('js.article.masonry.add_column')}>
                            <IconButton aria-label="Delete"
                                        className="masonry-button"
                                        onClick={this._handleColumnChange.bind(this, 1)}
                                        size="large">
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={I18n.t('js.article.masonry.remove_column')}>
                            <IconButton aria-label="Delete"
                                        className="masonry-button"
                                        onClick={this._handleColumnChange.bind(this, -1)}
                                        size="large">
                                <RemoveIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                }

                {
                    !!this.state.Masonry &&
                    <this.state.Masonry className="masonry-grid"
                                        elementType="div"
                                        options={this.state.masonryOptions}
                                        ref={this._masonryComponentRef}>
                        {ComponentNodes}
                    </this.state.Masonry>
                }
            </div>
        );
    }
});

export default MasonryWrapper;
