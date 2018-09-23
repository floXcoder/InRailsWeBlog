'use strict';

import '../../../stylesheets/components/collapsible.scss';

import {
    Collapse
} from 'react-collapse';

export default class Collapsible extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]).isRequired,
        isDefaultOpen: PropTypes.bool,
        isForceOpen: PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string,
        hasButton: PropTypes.bool
    };

    static defaultProps = {
        isDefaultOpen: true,
        hasButton: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: this.props.isDefaultOpen
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

    _handleClick = (event) => {
        event.preventDefault();

        this.setState({
            isOpen: !this.state.isOpen
        })
    };

    render() {
        let mainClass = classNames(
            'collapsible-item',
            this.props.className,
            {
                'collapsible-open': this.state.isOpen
            }
        );

        return (
            <div className={mainClass}>
                {
                    this.props.title &&
                    <div className="collapsible-title">
                        <a href="#"
                           onClick={this._handleClick}>
                            {this.props.title}

                            <span className="collapsible-button">
                                <span>
                                    toggle
                                </span>
                            </span>
                        </a>
                    </div>
                }

                <Collapse isOpened={this.state.isOpen}>
                    <div className="collapsible-content">
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );
    }
}
