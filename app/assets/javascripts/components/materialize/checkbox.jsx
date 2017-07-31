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
        multipleId: PropTypes.number,
        onCheckboxChange: PropTypes.func,
        isDefaultChecked: PropTypes.bool,
        isInputField: PropTypes.bool,
        isDisabled: PropTypes.bool,
        isMultiple: PropTypes.bool,
        isRequired: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        validator: PropTypes.object
    };

    static defaultProps = {
        id: null,
        name: null,
        className: null,
        children: null,
        onCheckboxChanged: null,
        isDefaultChecked: false,
        isInputField: true,
        isDisabled: false,
        isMultiple: false,
        isRequired: false,
        isHorizontal: false,
        validator: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        isChecked: (this.props.children === true || this.props.children === '1' || this.props.children === 'on' || this.props.isDefaultChecked) && this.props.children !== false,
        isValid: true
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.children !== nextProps.children) {
            this.setState({isChecked: nextProps.children});
        }
    }

    toggleCheckbox = () => {
        if (this.props.onCheckboxChange) {
            this.props.onCheckboxChange(!this.state.isChecked);
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
                'input-field': !this.props.isHorizontal && this.props.isInputField,
                'input-horizontal-field': this.props.isHorizontal,
                'row': this.props.isHorizontal
            });

        const labelClass = classNames({
            'col m4': this.props.isHorizontal
        });

        const checkboxClass = classNames({
            'col m8': this.props.isHorizontal,
            'filled-in': true,
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
                       onChange={this.toggleCheckbox}
                       {...this.props.validator}/>

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


