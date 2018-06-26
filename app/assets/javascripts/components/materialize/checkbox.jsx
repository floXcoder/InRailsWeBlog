'use strict';

export default class Checkbox extends React.PureComponent {
    static propTypes = {
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]).isRequired,
        id: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]),
        name: PropTypes.string,
        className: PropTypes.string,
        hasFillStyle: PropTypes.bool,
        multipleId: PropTypes.number,
        onChange: PropTypes.func,
        isDefaultChecked: PropTypes.bool,
        isInputField: PropTypes.bool,
        isDisabled: PropTypes.bool,
        isMultiple: PropTypes.bool,
        isRequired: PropTypes.bool,
        isHorizontal: PropTypes.bool
    };

    static defaultProps = {
        hasFillStyle: true,
        isDefaultChecked: false,
        isInputField: true,
        isDisabled: false,
        isMultiple: false,
        isRequired: false,
        isHorizontal: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isChecked: false,
        isValid: true
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const children = (nextProps.children === true || nextProps.children === '1' || nextProps.children === 'on' || nextProps.isDefaultChecked) && nextProps.children !== false;

        if (prevState.isChecked !== children) {
            return {
                ...prevState,
                isChecked: children
            };
        }

        return null;
    }

    toggleCheckbox = () => {
        if (this.props.onChange) {
            this.props.onChange(!this.state.isChecked);
        }

        this.setState({isChecked: !this.state.isChecked});

        return !this.state.isChecked;
    };

    isChecked = () => {
        return this.state.isChecked;
    };

    render() {
        const fieldClass = classNames(
            this.props.className,
            {
                'input-horizontal-field': this.props.isHorizontal,
                'row': this.props.isHorizontal
            });

        const labelClass = classNames({
            'col m4': this.props.isHorizontal
        });

        const checkboxClass = classNames({
            'col m8': this.props.isHorizontal,
            'filled-in': this.props.hasFillStyle,
            'invalid': !this.state.isValid
        });

        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }
        if (this.props.isMultiple) {
            name = name + '[]'
        }

        return (
            <div className={fieldClass}>
                {
                    this.props.isHorizontal &&
                    <label htmlFor={this.props.id}
                           className={labelClass}>
                        {this.props.title}
                    </label>
                }

                <input id={id}
                       className={checkboxClass}
                       type="checkbox"
                       name={name}
                       checked={this.state.isChecked}
                       data-unchecked-value="0"
                       disabled={this.props.isDisabled}
                       required={this.props.isRequired}
                       onChange={this.toggleCheckbox}/>

                <label htmlFor={this.props.id}>
                    {
                        !this.props.isHorizontal &&
                        this.props.title
                    }
                </label>
            </div>
        );
    }
}


