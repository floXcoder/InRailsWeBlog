'use strict';

export default class SwitchButton extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        values: PropTypes.shape({
            truthy: PropTypes.string,
            falsy: PropTypes.string
        }),
        title: PropTypes.string,
        isTitleDown: PropTypes.bool,
        titleClass: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]),
        isDefaultChecked: PropTypes.bool,
        isDisabled: PropTypes.bool,
        onSwitchChange: PropTypes.func,
        isHorizontal: PropTypes.bool,
        validator: PropTypes.object
    };

    static defaultProps = {
        values: {},
        isTitleDown: false,
        isDefaultChecked: true,
        isDisabled: false,
        isHorizontal: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isChecked: this.props.children === true || this.props.children === '1' || this.props.children === 'on' || this.props.isDefaultChecked
    };

    value = () => {
        return this.state.isChecked;
    };

    _handleSwitchChange = (event) => {
        if (this.props.onSwitchChange) {
            this.props.onSwitchChange(!this.state.isChecked);
        }

        this.setState({isChecked: !this.state.isChecked});

        return event;
    };

    render() {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        const fieldClass = classNames('switch', {
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const titleClass = classNames(
            this.props.titleClass,
            {
                'col m4': this.props.isHorizontal
            }
        );
        const labelClass = classNames({
            'col m8': this.props.isHorizontal
        });

        return (
            <div className={fieldClass}>
                {
                    (this.props.title && !this.props.isTitleDown) &&
                    <div className={titleClass}>
                        {this.props.title}
                    </div>
                }

                <label className={labelClass}>
                    {this.props.values.falsy}

                    <input ref={this.props.id}
                           id={id}
                           name={name}
                           type="checkbox"
                           disabled={this.props.isDisabled}
                           checked={this.state.isChecked}
                           value={this.state.isChecked ? '1' : '0'}
                           data-unchecked-value="0"
                           onChange={this._handleSwitchChange}
                           {...this.props.validator}/>

                    <span className="lever"/>

                    {this.props.values.truthy}
                </label>

                {
                    (this.props.title && this.props.isTitleDown) &&
                    <div className={titleClass}>
                        {this.props.title}
                    </div>
                }
            </div>
        );
    }
}

