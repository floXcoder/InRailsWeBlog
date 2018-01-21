'use strict';

import _ from 'lodash';

export default class Button extends React.PureComponent {
    static propTypes = {
        children: PropTypes.string.isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        icon: PropTypes.string,
        iconPosition: PropTypes.string,
        tooltip: PropTypes.string,
        onButtonClick: PropTypes.func
    };

    static defaultProps = {
        type: 'submit',
        iconPosition: 'right'
    };

    constructor(props) {
        super(props);
    }

    state = {
        isDisabled: false
    };

    render() {
        let tooltipData = {};
        if (this.props.tooltip) {
            tooltipData = {
                'data-tooltip': this.props.tooltip
            };
        }

        const buttonClass = classNames(
            'btn waves-effect waves-light',
            this.props.className,
            {'tooltip-bottom': !Utils.isEmpty(this.props.tooltip)}
        );

        return (
            <button className={buttonClass}
                    id={this.props.id}
                    type={this.props.type}
                    method="post"
                    onClick={this.props.onButtonClick}
                    disabled={this.state.disabled}
                    {...tooltipData}>
                {
                    this.props.icon &&
                    <span className={classNames('material-icons', this.props.iconPosition)}
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }
                {this.props.children}
            </button>
        );
    }
}

