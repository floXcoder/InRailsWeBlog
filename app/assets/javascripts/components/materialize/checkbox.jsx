'use strict';

const classNames = require('classnames');

var Checkbox = React.createClass({
    propTypes: {
        title: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]).isRequired,
        id: React.PropTypes.string,
        children: React.PropTypes.bool,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        onCheckboxChange: React.PropTypes.func,
        isDisabled: React.PropTypes.bool,
        isMultiple: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            id: null,
            name: null,
            children: null,
            onCheckboxChanged: null,
            checked: false,
            isDisabled: false,
            isMultiple: false,
            isRequired: false,
            isHorizontal: false,
            validator: null
        };
    },

    getInitialState () {
        return {
            checked: this.props.children !== false,
            isDisabled: this.props.isDisabled || false,
            valid: true
        };
    },

    shouldComponentUpdate (nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state, nextState);
    },

    toggleCheckbox () {
        this.setState({checked: !this.state.checked});
        return !this.state.checked;
    },

    isChecked () {
        return this.state.checked;
    },

    render () {
        const fieldClass = classNames({
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames({
            'col m4': this.props.isHorizontal
        });

        const checkboxClass = classNames({
            'col m8': this.props.isHorizontal,
            'filled-in': true,
            'invalid': !this.state.valid
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

                <input ref={this.props.id}
                       id={id}
                       className={checkboxClass}
                       type="checkbox"
                       name={name}
                       checked={this.state.checked}
                       data-unchecked-value="0"
                       disabled={this.state.disabled}
                       required={this.props.isRequired}
                       onChange={this.props.onCheckboxChange || this.toggleCheckbox}
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
});

module.exports = Checkbox;

