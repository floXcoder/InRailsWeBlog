'use strict';

var classNames = require('classnames');

var Input = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        type: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        classType: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        name: React.PropTypes.string,
        icon: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        autoComplete: React.PropTypes.string,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onInput: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        characterCount: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            type: 'text',
            disabled: false,
            name: null,
            placeholder: null,
            icon: null,
            autoComplete: null,
            minLength: null,
            maxLength: null,
            onBlur: null,
            onChange: null,
            onInput: null,
            onKeyDown: null,
            characterCount: null
        };
    },

    getInitialState () {
        return {
            valid: true,
            textSuccess: null,
            textError: null
        };
    },

    componentDidMount () {
        if(this.props.characterCount) {
            let $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
            $currentElement.attr('length', this.props.characterCount);
            $currentElement.characterCounter();
        }
    },

    setValid (textSuccess) {
        this.setState({
            valid: true,
            textSuccess: textSuccess ? textSuccess : null,
            textError: null
        });
    },

    setInvalid (textError) {
        this.setState({
            valid: false,
            textSuccess: null,
            textError: textError
        });
    },

    focus () {
        this.refs[this.props.id].focus();
    },

    value () {
        return this.refs[this.props.id].value;
    },

    setValue (value) {
        this.refs[this.props.id].value = value;
    },

    reset () {
        this.setState({
            valid: true,
            textSuccess: null,
            textError: null
        });
    },

    renderIcon () {
        if (this.props.icon) {
            return (
                <i className="material-icons prefix">{this.props.icon}</i>
            )
        }
    },

    render () {
        let inputClass = classNames({
            'valid': this.state.valid,
            'invalid': !this.state.valid
        });

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            name = this.props.id.replace('_', '[') + ']';
        }

        return (
            <div className="input-field">
                {this.renderIcon()}

                <input ref={this.props.id}
                       id={this.props.id}
                       className={inputClass}
                       type={this.props.type}
                       disabled={this.props.disabled}
                       placeholder={this.props.placeholder}
                       name={name}
                       minLength={this.props.minLength}
                       maxLength={this.props.maxLength}
                       onBlur={this.props.onBlur}
                       onInput={this.props.onInput}
                       onKeyDown={this.props.onKeyDown}
                       autoComplete={this.props.autoComplete}
                       onChange={this.props.onChange}/>

                <label htmlFor={this.props.id}
                       className={this.props.classType}
                       data-success={this.state.textSuccess}
                       data-error={this.state.textError}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Input;
