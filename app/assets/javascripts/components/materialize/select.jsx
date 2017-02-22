'use strict';

const classNames = require('classnames');

var Select = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        default: React.PropTypes.string.isRequired,
        options: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array
        ]),
        name: React.PropTypes.string,
        optionsOrder: React.PropTypes.array,
        multipleId: React.PropTypes.number,
        isDisabled: React.PropTypes.bool,
        isMultiple: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        isCategorized: React.PropTypes.bool,
        categories: React.PropTypes.object,
        icon: React.PropTypes.string,
        onSelectChange: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            children: null,
            name: null,
            multipleId: null,
            optionsOrder: null,
            isDisabled: false,
            isMultiple: false,
            isRequired: false,
            isCategorized: false,
            categories: null,
            icon: null,
            onSelectChange: null,
            isHorizontal: false,
            validator: null
        };
    },

    componentDidMount () {
        this._initSelect();
    },

    componentDidUpdate () {
        this._initSelect();
    },

    _initSelect () {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        const selector = `select#${id}`;
        $(selector).material_select();
        $(selector).on('change', this._handleSelectChange);
    },

    value () {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;
        return this.refs[id].value;
    },

    _handleSelectChange (event) {
        if (this.props.onSelectChange) {
            this.props.onSelectChange(event.target.value);
        }
        return event;
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

        const selectClass = classNames({
            'col m8': this.props.isHorizontal
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

        let defaultValue = this.props.children || (this.props.isMultiple ? ['default'] : 'default');

        let SelectOptions, option;
        if (this.props.isCategorized) {
            SelectOptions = Object.keys(this.props.categories).map((categoryName) => {
                option = this.props.categories[categoryName];
                return (
                    <optgroup key={categoryName}
                              label={categoryName}>
                        {
                            option.map((key) =>
                                <option key={key}
                                        value={key}>
                                    {key}
                                </option>
                            )
                        }
                    </optgroup>
                );
            });
        } else if (this.props.optionsOrder) {
            SelectOptions = this.props.optionsOrder.map((key) => {
                option = this.props.options[key];
                return (
                    <option key={key}
                            value={key}>
                        {option}
                    </option>
                );
            });
        } else {
            if (Array.isArray(this.props.options)) {
                SelectOptions = this.props.options.map((key, i) => {
                    return (
                        <option key={i}
                                value={key}>
                            {key}
                        </option>
                    );
                });
            } else {
                SelectOptions = Object.keys(this.props.options).map((key) => {
                    option = this.props.options[key];
                    return (
                        <option key={key}
                                value={key}>
                            {option}
                        </option>
                    );
                });
            }
        }

        return (
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <i className="material-icons left prefix">{this.props.icon}</i>
                }

                {
                    this.props.isHorizontal &&
                    <label className={labelClass}>
                        {this.props.title}
                    </label>
                }

                <select ref={id}
                        id={id}
                        name={name}
                        className={selectClass}
                        disabled={this.props.isDisabled}
                        required={this.props.isRequired}
                        multiple={this.props.isMultiple}
                        defaultValue={defaultValue}
                        onChange={this._handleSelectChange}
                    {...this.props.validator}>
                    <option value="default"
                            disabled="true">
                        {this.props.default}
                    </option>
                    {SelectOptions}
                </select>

                {
                    !this.props.isHorizontal &&
                    <label className={labelClass}>
                        {this.props.title}
                    </label>
                }
            </div>
        );
    }
});

module.exports = Select;

