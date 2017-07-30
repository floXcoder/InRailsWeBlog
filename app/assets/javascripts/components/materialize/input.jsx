'use strict';

import _ from 'lodash';

export default class Input extends React.Component {
    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        id: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        title: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        placeholder: React.PropTypes.string,
        explanation: React.PropTypes.string,
        type: React.PropTypes.string,
        isHorizontal: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        isReadOnly: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        labelClass: React.PropTypes.string,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        icon: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        step: React.PropTypes.number,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        hasAutoFocus: React.PropTypes.bool,
        isAutoComplete: React.PropTypes.bool,
        onFocus: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onInput: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onKeyPress: React.PropTypes.func,
        onKeyUp: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        characterCount: React.PropTypes.number,
        mask: React.PropTypes.object,
        validator: React.PropTypes.object
    };

    static defaultProps = {
        className: null,
        type: 'text',
        children: '',
        name: null,
        multipleId: null,
        title: null,
        placeholder: null,
        explanation: null,
        isHorizontal: false,
        isRequired: false,
        isReadOnly: false,
        isDisabled: false,
        labelClass: null,
        icon: null,
        hasAutoFocus: null,
        isAutoComplete: null,
        step: null,
        minLength: null,
        maxLength: null,
        onFocus: null,
        onChange: null,
        onInput: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onBlur: null,
        characterCount: null,
        mask: null,
        validator: null
    };

    state = {
        value: this.props.children || ''
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.characterCount) {
            const $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
            $currentElement.attr('length', this.props.characterCount);
            // $currentElement.characterCounter();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.className, nextProps.className) || !_.isEqual(this.state.value, nextState.value) || !_.isEqual(this.props.isRequired, nextProps.isRequired) || !_.isEqual(this.props.validator, nextProps.validator);
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
                'col m8': this.props.isHorizontal
            }
        );

        return (
            <div className={wrapperClass}>
                <div className={fieldClass}>
                    {
                        this.props.icon && $.is().isString(this.props.icon) &&
                        <i className={iconClass}>{this.props.icon}</i>
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
                           {...this.props.validator}
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

