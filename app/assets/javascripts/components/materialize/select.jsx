'use strict';

export default class Select extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        default: PropTypes.string.isRequired,
        options: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]).isRequired,
        title: PropTypes.string.isRequired,
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        name: PropTypes.string,
        optionsOrder: PropTypes.array,
        multipleId: PropTypes.number,
        isDisabled: PropTypes.bool,
        isMultiple: PropTypes.bool,
        isRequired: PropTypes.bool,
        isCategorized: PropTypes.bool,
        categories: PropTypes.object,
        icon: PropTypes.string,
        isHorizontal: PropTypes.bool,
        validator: PropTypes.object,
        onSelectChange: PropTypes.func
    };

    static defaultProps = {
        children: null,
        name: null,
        className: null,
        multipleId: null,
        optionsOrder: null,
        isDisabled: false,
        isMultiple: false,
        isRequired: false,
        isCategorized: false,
        categories: null,
        icon: null,
        isHorizontal: false,
        validator: null,
        onSelectChange: null
    };

    constructor(props) {
        super(props);

        this._value = null;
    }

    componentDidMount() {
        this._initSelect(true);
    }

    componentDidUpdate() {
        this._initSelect();
    }

    _initSelect = (init = false) => {
        const id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        const selector = `select#${id}`;
        $(selector).material_select();
        if (init) {
            $(selector).on('change', this._handleSelectChange);
        }
    };

    _handleSelectChange = (event) => {
        if (this.props.isMultiple) {
            this._value = [...event.target.options].filter(o => o.selected).map(o => o.value);
        } else {
            this._value = event.target.value;
        }

        if (this.props.onSelectChange) {
            this.props.onSelectChange(this._value);
        }

        return event;
    };

    value = () => {
        const id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;
        return this.refs[id].value;
    };

    render() {
        const fieldClass = classNames(
            this.props.className,
            {
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

        const id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

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

        let value = this._value || this.props.children || 'default';

        if (this.props.isMultiple && !Array.isArray(value)) {
            value = [value];
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

                <div className={selectClass}>
                    <select ref={id}
                            id={id}
                            name={name}
                            disabled={this.props.isDisabled}
                            required={this.props.isRequired}
                            multiple={this.props.isMultiple}
                            value={value}
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
            </div>
        );
    }
}


