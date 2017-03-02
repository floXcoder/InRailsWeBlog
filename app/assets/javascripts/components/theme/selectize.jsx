'use strict';

import ReactSelectize from 'react-selectize';
const MultiSelect = ReactSelectize.MultiSelect;

export default class Selectize extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string.isRequired,
        elements: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]).isRequired,
        title: React.PropTypes.string,
        name: React.PropTypes.string,
        children: React.PropTypes.array,
        icon: React.PropTypes.string,
        isCategorized: React.PropTypes.bool,
        maxValues: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        multipleId: React.PropTypes.number,
        isMultiple: React.PropTypes.bool,
        isEditing: React.PropTypes.bool,
        isHorizontal: React.PropTypes.bool,
        onValuesChange: React.PropTypes.func
    };

    static defaultProps = {
        title: null,
        name: null,
        children: [],
        icon: null,
        isCategorized: false,
        maxValues: 5,
        maxLength: 30,
        multipleId: null,
        isMultiple: true,
        isEditing: false,
        isHorizontal: false,
        onValuesChange: null
    };

    state = {
        values: (() => _.compact(this.props.children.map((element) => !$.isEmpty(element) ? {
                label: element,
                value: element
            } : null
        )))(),
    };

    constructor(props) {
        super(props);
    }

    _handleValuesFromPaste = (options, values, pastedText) => {
        return pastedText
            .split(',')
            .filter((text) => {
                let labels = values.map((item) => {
                    return item.label;
                });
                return labels.indexOf(text) == -1;
            })
            .map(function (text) {
                return {
                    label: text,
                    value: text
                };
            });
    };

    _handleRestoreOnBackspace = (item) => {
        return item.label;
    };

    _handleOnValuesChange = (items) => {
        const newValues = _.filter(items, (item) => item.label.length < this.props.maxLength);

        this.setState({
            values: newValues
        });

        if (this.props.onValuesChange) {
            this.props.onValuesChange(newValues.map((item) => item.value));
        }
    };

    _handleRemoveValue = (item) => {
        const newValues = _.reject(this.state.values, (value) => value.value == item.value);

        this.setState({
            values: newValues
        });

        if (this.props.onValuesChange) {
            this.props.onValuesChange(newValues.map((item) => item.value));
        }
    };

    _handleCreateFromSearch = (options, values, search) => {
        let labels = values.map((value) => {
            return value.label;
        });

        if (search.trim().length === 0 || labels.indexOf(search.trim()) != -1) {
            return null;
        }

        return {
            label: search.trim(),
            value: search.trim()
        };
    };

    _handleRenderNoResults = () => {
        return (
            <div className="no-results-found">
                {I18n.t('js.selectize.no_results')}
            </div>
        );
    };

    _handleRenderNoResultsFound = (values, search) => {
        return (
            <div className="no-results-found">
                {
                    search.trim().length === 0 &&
                    I18n.t('js.selectize.tags.type')
                }
                {
                    values.map((item) => item.label).indexOf(search.trim()) !== -1 &&
                    I18n.t('js.selectize.tags.already_exists')
                }
            </div>
        );
    };

    _handleRenderOption = (item) => {
        let renderString = item.label;
        if (item.label && item.label.length >= this.props.maxLength) {
            renderString = I18n.t('js.selectize.tags.too_long');
        } else if (!!item.newOption) {
            renderString = I18n.t('js.selectize.tags.add') + ' ' + item.label + ' ...';
        }

        return (
            <div className="simple-option"
                 style={{display: 'flex', alignItems: 'center'}}>
                <div >
                    {renderString}
                </div>
            </div>
        );
    };

    _handleRenderValue = (item) => {
        return (
            <div className="simple-value removeable-value">
                <span onClick={this._handleRemoveValue.bind(this, item)}>x</span>
                <span>
                    {item.value}
                </span>
            </div>
        );
    };

    value = () => {
        return this.state.values;
    };

    render() {
        const fieldClass = classNames('selectize', {
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
            name = name + '[]'
        }

        let groups = null;
        let options = null;
        if (this.props.isCategorized) {
            if ($.is().isObject(this.props.elements) === false) {
                throw new Error('Selectize \'elements\' must be an object.');
            }

            groups = Object.keys(this.props.elements).map((category) => {
                return {
                    groupId: category,
                    title: category
                }
            });

            options = _.flatten(Object.keys(this.props.elements).map((category) => {
                let options = this.props.elements[category];
                return (options.map((option) => {
                    return {
                        groupId: category,
                        label: option,
                        value: option
                    };
                }));
            }));
        } else {
            if (Array.isArray(this.props.elements) === false) {
                throw new Error('Selectize \'elements\' must be an array.');
            }

            options = _.compact(this.props.elements).map((element) => {
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
            });
        }

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
                            <MultiSelect id={id}
                                         name={name}
                                         placeholder={this.props.placeholder}
                                         theme="material"
                                         transitionEnter={true}
                                         transitionLeave={true}
                                         maxValues={this.props.maxValues}
                                         options={options}
                                         values={this.state.values}
                                         delimiters={[188]}
                                         valuesFromPaste={this._handleValuesFromPaste}
                                         restoreOnBackspace={this._handleRestoreOnBackspace}
                                         onValuesChange={this._handleOnValuesChange}
                                         createFromSearch={this._handleCreateFromSearch}
                                         renderNoResultsFound={this._handleRenderNoResultsFound}
                                         renderOption={this._handleRenderOption}
                                         renderValue={this._handleRenderValue}/>
                            :
                            <MultiSelect id={id}
                                         name={name}
                                         theme="material"
                                         transitionEnter={true}
                                         transitionLeave={true}
                                         groups={groups}
                                         groupsAsColumns={true}
                                         options={options}
                                         values={this.state.values}
                                         onValuesChange={this._handleOnValuesChange}
                                         renderValue={this._handleRenderValue}
                                         placeholder={this.props.placeholder}
                                         maxValues={this.props.maxValues}
                                         renderNoResultsFound={this._handleRenderNoResults}/>

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

