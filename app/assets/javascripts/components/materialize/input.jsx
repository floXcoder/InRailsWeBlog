'use strict';

import _ from 'lodash';

export default class Input extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        id: PropTypes.string.isRequired,
        className: PropTypes.string,
        title: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
        placeholder: PropTypes.string,
        explanation: PropTypes.string,
        type: PropTypes.string,
        isHorizontal: PropTypes.bool,
        isRequired: PropTypes.bool,
        isReadOnly: PropTypes.bool,
        isDisabled: PropTypes.bool,
        labelClass: PropTypes.string,
        hasError: PropTypes.bool,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        icon: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        hasAutoFocus: PropTypes.bool,
        isAutoComplete: PropTypes.bool,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        onInput: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyPress: PropTypes.func,
        onKeyUp: PropTypes.func,
        onBlur: PropTypes.func,
        characterCount: PropTypes.number,
        mask: PropTypes.object
    };

    static defaultProps = {
        type: 'text',
        children: '',
        isHorizontal: false,
        isRequired: false,
        isReadOnly: false,
        isDisabled: false,
        hasError: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        value: this.props.children || ''
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.children !== nextProps.children) {
            this.setState({
                value: nextProps.children
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.value, nextState.value) || !_.isEqual(this.props.className, nextProps.className) || !_.isEqual(this.props.isRequired, nextProps.isRequired);
    }

    _handleChange = (event) => {
        const newValue = event.target.value;

        this.setState({value: newValue});

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    };

    focus = () => {
        this.refs[this.props.id].focus();
    };

    value = () => {
        return this.refs[this.props.id].value;
    };

    setValue = (newValue) => {
        this.setState({
            value: newValue
        });
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

        const wrapperClass = classNames({
            'row input-form': this.props.type !== 'hidden'
        });

        const fieldClass = classNames({
            'input-field': !this.props.isHorizontal && this.props.type !== 'hidden',
            'input-horizontal-field': this.props.isHorizontal,
            'required-field': this.props.isRequired,
            'col s12': !this.props.isHorizontal && this.props.type !== 'hidden'
        });

        const iconClass = classNames(
            'material-icons',
            'prefix',
            {
                active: !!this.props.children || this.state.value
            }
        );

        const labelClass = classNames(
            this.props.labelClass,
            {
                active: !!this.props.children || this.state.value || this.props.placeholder,
                'col m4': this.props.isHorizontal
            }
        );

        const inputClass = classNames(
            this.props.className,
            'validate',
            {
                'col m8': this.props.isHorizontal,
                'input-error': this.props.hasError
            }
        );

        return (
            <div className={wrapperClass}>
                <div className={fieldClass}>
                    {
                        this.props.icon && $.is().isString(this.props.icon) &&
                        <span className={iconClass}
                              data-icon={this.props.icon}
                              aria-hidden="true"/>
                    }

                    {
                        this.props.icon && $.is().isObject(this.props.icon) &&
                        this.props.icon
                    }

                    {
                        (this.props.title && this.props.isHorizontal) &&
                        <label htmlFor={this.props.id}
                               className={labelClass}>
                            {this.props.title}
                        </label>
                    }

                    <input ref={this.props.id}
                           id={id}
                           className={inputClass}
                           type={this.props.type}
                           required={this.props.isRequired}
                           disabled={this.props.isDisabled}
                           readOnly={this.props.isReadOnly}
                           placeholder={this.props.placeholder}
                           name={name}
                           step={this.props.step}
                           min={this.props.min}
                           max={this.props.max}
                           minLength={this.props.minLength}
                           maxLength={this.props.maxLength}
                           autoFocus={this.props.hasAutoFocus}
                           autoComplete={this.props.isAutoComplete}
                           onFocus={this.props.onFocus}
                           onChange={this._handleChange}
                           onInput={this.props.onInput}
                           onKeyDown={this.props.onKeyDown}
                           onKeyPress={this.props.onKeyPress}
                           onKeyUp={this.props.onKeyUp}
                           onBlur={this.props.onBlur}
                           value={this.state.value}
                           data-length={this.props.characterCount}
                           {...this.props.mask}/>

                    {
                        (this.props.title && !this.props.isHorizontal) &&
                        <label htmlFor={this.props.id}
                               className={labelClass}>
                            {this.props.title}
                        </label>
                    }

                    {
                        this.props.explanation &&
                        <div className="input-field-explanation">
                            {this.props.explanation}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

