'use strict';

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
        isOpen: PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string,
        hasButton: PropTypes.bool
    };

    static defaultProps = {
        isDefaultOpen: true,
        isOpen: true,
        hasButton: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: this.props.isDefaultOpen
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen !== nextProps.isOpen) {
            this.setState({
                isOpen: nextProps.isOpen
            });
        }
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
                            <button>
                                toggle
                            </button>
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
