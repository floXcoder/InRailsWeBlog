'use strict';

import Select, {
    Creatable
} from 'react-select';

export default class Selecter extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        elements: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        children: PropTypes.array,
        icon: PropTypes.string,
        maxValues: PropTypes.number,
        maxLength: PropTypes.number,
        multipleId: PropTypes.number,
        isMultiple: PropTypes.bool,
        isEditing: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        isClearable: PropTypes.bool,
        isImageValue: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        children: [],
        maxValues: 5,
        maxLength: 30,
        isMultiple: true,
        isEditing: false,
        isHorizontal: false,
        isClearable: true,
        isImageValue: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        inputValue: '',
        values: (() => ((this.props.children || []).map((element) => !Utils.isEmpty(element) ? {
                label: element,
                value: element
            } : null
        )).compact())(),
    };

    _handleInputChange = (inputValue) => {
        this.setState({
            inputValue
        });
    };

    _handleKeyDown = (event) => {
        const {
            inputValue,
            values
        } = this.state;

        if (!inputValue) return;

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                if (inputValue.length >= this.props.maxLength) {
                    this.setState({
                        inputValue: I18n.t('js.selecter.tags.too_long')
                    });
                } else {
                    this._handleChange([...values, this._handleCreateOption(inputValue)])
                }
                event.preventDefault();
        }
    };

    _handleChange = (items) => {
        const newValues = items.filter((item) => item.label.length < this.props.maxLength);

        if (newValues.length > this.props.maxValues) {
            return;
        }

        this.setState({
            inputValue: '',
            values: newValues
        });

        if (this.props.onChange) {
            this.props.onChange(newValues.map((item) => item.value));
        }
    };

    _handleCreateOption = (label) => {
        return {
            label: label,
            value: label
        };
    };

    value = () => {
        return this.state.values;
    };

    render() {
        const fieldClass = classNames('selecter', {
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames({
            'col m4': this.props.isHorizontal
        });

        const iconClass = classNames(
            'material-icons',
            'prefix',
            'left'
        );

        const selectClass = classNames('select-wrapper', {
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
            name = name + '[]';
        }

        if (Array.isArray(this.props.elements) === false) {
            throw new Error('Selecter "elements" must be an array.');
        }

        let options = this.props.elements.map((element) => {
            if (Array.isArray(element)) {
                return {
                    label: element[1],
                    value: element[0]
                };
            } else {
                return {
                    label: element,
                    value: element
                };
            }
        }).compact();

        const noResults = (
            <div className="no-results-found">
                {I18n.t('js.selecter.no_results')}
            </div>
        );

        const selectDefaultProps = {
            id: id,
            name: name,
            isMulti: this.props.isMultiple,
            isClearable: this.props.isClearable,
            classNamePrefix: 'react-select',
            placeholder: this.props.placeholder,
            options: options,
            inputValue: this.state.inputValue,
            value: this.state.values,
            noOptionsMessage: noResults,
            delimiter: ',',
            onChange: this._handleChange,
            onInputChange: this._handleInputChange,
            onKeyDown: this._handleKeyDown
        };

        const components = {
            DropdownIndicator: null,
        };

        return (
            <div className={fieldClass}>
                {
                    (this.props.icon && !this.props.isHorizontal) &&
                    <i className={iconClass}>{this.props.icon}</i>
                }

                {
                    (this.props.title && this.props.isHorizontal) &&
                    <label className={labelClass}>
                        {this.props.title}
                    </label>
                }

                <div className={selectClass}>
                    {
                        this.props.isEditing
                            ?
                            <Creatable {...selectDefaultProps}
                                       promptTextCreator={this._handleCreateOption}
                                       menuIsOpen={false}
                                       components={components}
                            />
                            :
                            <Select {...selectDefaultProps}/>
                    }
                </div>

                {
                    (this.props.title && !this.props.isHorizontal) &&
                    <label className={labelClass}>
                        {this.props.title}
                    </label>
                }
            </div>
        );
    }
}

