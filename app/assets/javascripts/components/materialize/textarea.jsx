'use strict';

const classNames = require('classnames');

var Textarea = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
        children: React.PropTypes.string,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        isRequired: React.PropTypes.bool,
        icon: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        onChange: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        characterCount: React.PropTypes.number,
        validator: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            title: null,
            name: null,
            multipleId: null,
            children: null,
            isRequired: false,
            icon: null,
            minLength: null,
            maxLength: null,
            onChange: null,
            onKeyDown: null,
            onBlur: null,
            characterCount: null,
            validator: null
        };
    },

    getInitialState () {
        return {
            hasValue: false
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
        return !_.isEqual(this.state.hasValue, nextState.hasValue) || this.props.children !== nextProps.children;
    },

    value () {
        return this.refs[this.props.id].value;
    },

    setValue (value) {
        this.refs[this.props.id].value = value;

        if (!this.state.hasValue) {
            this.setState({
                hasValue: true
            });
        }
    },

    focus () {
        this.refs[this.props.id].focus();
    },

    autoResize () {
        $(ReactDOM.findDOMNode(this.refs[this.props.id])).trigger('autoresize');
    },

    render () {
        const labelClass = classNames(
            {
                active: !!this.props.children || this.state.hasValue
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
            <div className="input-field">
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                <textarea ref={this.props.id}
                          id={id}
                          name={name}
                          className="materialize-textarea"
                          required={this.props.isRequired}
                          minLength={this.props.minLength}
                          maxLength={this.props.maxLength}
                          onChange={this.props.onChange}
                          onKeyDown={this.props.onKeyDown}
                          onBlur={this.props.onBlur}
                          defaultValue={this.props.children}
                          {...this.props.validator}/>

                {
                    this.props.title &&
                    <label htmlFor={this.props.id}
                           className={labelClass}>
                        {this.props.title}
                    </label>
                }
            </div>
        );
    }
});

module.exports = Textarea;
