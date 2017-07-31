'use strict';

export default class Submit extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.array,
            PropTypes.string
        ]).isRequired,
        className: PropTypes.string,
        isDisabled: PropTypes.bool,
        isButton: PropTypes.bool,
        tooltipMessage: PropTypes.string,
        onClick: PropTypes.func
    };

    static defaultProps = {
        className: null,
        isDisabled: false,
        isButton: false,
        tooltipMessage: null,
        onClick: null
    };

    constructor(props) {
        super(props);

        this._submit = null;
    }

    focus = () => {
        if (this._submit) {
            this._submit.focus();
        }
    };

    render() {
        return (
            this.props.isButton
                ?
                <button ref={(submit) => this._submit = submit}
                        id={this.props.id}
                        type="submit"
                        name="commit"
                        className={classNames('btn-floating waves-effect waves-light', this.props.className, {
                            tooltipped: !$.isEmpty(this.props.tooltipMessage),
                            disabled: this.props.isDisabled
                        })}
                        data-position="top"
                        data-delay="50"
                        data-tooltip={this.props.tooltipMessage}
                        onClick={this.props.onClick}>
                    {this.props.children}
                </button>
                :
                <input ref={(submit) => this._submit = submit}
                       id={this.props.id}
                       type="submit"
                       name="commit"
                       disabled={this.props.isDisabled}
                       className={classNames('btn', this.props.className, {
                           tooltipped: !$.isEmpty(this.props.tooltipMessage),
                           disabled: this.props.isDisabled
                       })}
                       data-position="top"
                       data-delay="50"
                       data-tooltip={this.props.tooltipMessage}
                       value={this.props.children}
                       onClick={this.props.onClick}/>
        );
    }
}

