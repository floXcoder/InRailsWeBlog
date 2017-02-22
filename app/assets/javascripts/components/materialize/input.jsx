'use strict';

const classNames = require('classnames');

var Input = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        type: React.PropTypes.string,
        isRequired: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        labelClass: React.PropTypes.string,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        icon: React.PropTypes.string,
        step: React.PropTypes.number,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        autoFocus: React.PropTypes.bool,
        autoComplete: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onInput: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        characterCount: React.PropTypes.number,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object,
        mask: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            type: 'text',
            children: null,
            name: null,
            multipleId: null,
            title: null,
            placeholder: null,
            isRequired: false,
            isDisabled: false,
            labelClass: null,
            icon: null,
            autoComplete: null,
            step: null,
            minLength: null,
            maxLength: null,
            autoFocus: false,
            onChange: null,
            onInput: null,
            onBlur: null,
            onKeyDown: null,
            characterCount: null,
            isHorizontal: false,
            validator: null,
            mask: null
        };
    },

    getInitialState () {
        return {
            value: null
        };
    },

    componentDidMount () {
        if (this.props.characterCount) {
            const $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
            $currentElement.attr('length', this.props.characterCount);
            // $currentElement.characterCounter();
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.value, nextState.value);
    },

    focus () {
        this.refs[this.props.id].focus();
    },

    value () {
        return this.refs[this.props.id].value;
    },

    setValue (value) {
        ReactDOM.findDOMNode(this.refs[this.props.id]).value = value;
        this.setState({
            value: value
        });
    },

    render () {
        const fieldClass = classNames({
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames(
            this.props.labelClass,
            {
                active: !!this.props.children || this.state.value,
                'col m4': this.props.isHorizontal
            }
        );

        const inputClass = classNames(
            'validate',
            {
                'col m8': this.props.isHorizontal
            }
        );

        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        return (
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                {
                    this.props.title &&
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
                       placeholder={this.props.placeholder}
                       name={name}
                       step={this.props.step}
                       minLength={this.props.minLength}
                       maxLength={this.props.maxLength}
                       autoFocus={this.props.autoFocus}
                       onChange={this.props.onChange}
                       onInput={this.props.onInput}
                       onKeyDown={this.props.onKeyDown}
                       onBlur={this.props.onBlur}
                       autoComplete={this.props.autoComplete}
                       defaultValue={this.props.children}
                    {...this.props.validator}
                    {...this.props.mask}/>
            </div>
        );
    }
});

module.exports = Input;
