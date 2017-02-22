'use strict';

const ReactSelectize = require('react-selectize');
const MultiSelect = ReactSelectize.MultiSelect;

const classNames = require('classnames');

var Selectize = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string.isRequired,
        elements: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]).isRequired,
        children: React.PropTypes.array,
        isCategorized: React.PropTypes.bool,
        name: React.PropTypes.string,
        maxValues: React.PropTypes.number,
        multipleId: React.PropTypes.number,
        isMultiple: React.PropTypes.bool,
        isEditing: React.PropTypes.bool,
        isHorizontal: React.PropTypes.bool
    },

    getDefaultProps () {
        return {
            name: null,
            children: [],
            maxValues: 5,
            multipleId: null,
            isMultiple: true,
            isEditing: false,
            isHorizontal: false
        };
    },

    getInitialState () {
        return {
            values: this.props.children.map((element) => {
                return {label: element, value: element}
            })
        };
    },

    _handleValuesFromPaste (options, values, pastedText) {
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
    },

    _handleRestoreOnBackspace (item) {
        return item.label;
    },

    _handleOnValuesChange (values) {
        this.setState({values: values});
    },

    _handleCreateFromSearch (options, values, search) {
        let labels = values.map((value) => {
            return value.label;
        });

        if (search.trim().length == 0 || labels.indexOf(search.trim()) != -1) {
            return null;
        }

        return {
            label: search.trim(),
            value: search.trim()
        };
    },

    _handleRenderNoResultsFound (values, search) {
        return (
            <div className="no-results-found">
                {
                    search.trim().length == 0 &&
                    I18n.t('js.selectize.tags.type')
                }
                {
                    values.map((item) => item.label).indexOf(search.trim()) != -1 &&
                    I18n.t('js.selectize.tags.already_exists')
                }
            </div>
        );
    },

    _handleRenderOption (item) {
        return (
            <div className="simple-option"
                 style={{display: 'flex', alignItems: 'center'}}>
                <div >
                    {!!item.newOption ? I18n.t('js.selectize.tags.add') + ' ' + item.label + ' ...' : item.label}
                </div>
            </div>
        );
    },

    _handleRemoveValue (item, event) {
        event.preventDefault();
        this.setState({
            values: _.reject(this.state.values, (value) => value.value == item.value)
        });
    },

    _handleRenderValue (item) {
        return (
            <div className="simple-value removeable-value">
                <span onClick={this._handleRemoveValue.bind(this, item)}>x</span>
                <span>
                    {item.value}
                </span>
            </div>
        );
    },

    render () {
        const fieldClass = classNames('selectize', {
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames({
            'col m4': this.props.isHorizontal
        });

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
            options = this.props.elements.map((element) => {
                return {
                    label: element,
                    value: element
                };
            });
        }

        return (
            <div className={fieldClass}>
                {
                    this.props.isHorizontal &&
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
                                         renderNoResultsFound={() => <div>{I18n.t('js.selectize.no_results')}</div>}/>

                    }
                </div>

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

module.exports = Selectize;
