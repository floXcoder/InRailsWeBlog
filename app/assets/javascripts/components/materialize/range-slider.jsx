'use strict';

const noUiSlider = require('materialize-css/extras/noUiSlider/nouislider');

const classNames = require('classnames');

var RangeSlider = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        range: React.PropTypes.array.isRequired,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        unit: React.PropTypes.string,
        icon: React.PropTypes.string,
        children: React.PropTypes.array,
        isHorizontal: React.PropTypes.bool,
        isDisplayRange: React.PropTypes.bool,
        hasInputForDefaultValues: React.PropTypes.bool,
        onSliderChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            name: null,
            multipleId: null,
            unit: null,
            icon: null,
            children: null,
            isHorizontal: false,
            isDisplayRange: false,
            hasInputForDefaultValues: true,
            onSliderChange: null
        };
    },

    getInitialState () {
        return {
            values: null
        };
    },

    componentDidMount() {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        var sliderIdSelector = document.getElementById(`${id}-slider`);

        noUiSlider.create(sliderIdSelector, {
            start: this.props.children || this.props.range,
            connect: true,
            step: 1,
            range: {
                'min': this.props.range[0],
                'max': this.props.range[1]
            },
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Math.round(value);
                }
            }
        });

        sliderIdSelector.noUiSlider.on('update', (values, handle) => {
            if (!this.props.hasInputForDefaultValues) {
                if (!_.isEqual(this.props.range, values)) {
                    this.refs.sliderInputValues.value = values;
                } else {
                    this.refs.sliderInputValues.value = null;
                }
            } else {
                this.refs.sliderInputValues.value = values;
            }

            if (this.props.onSliderChange) {
                this.props.onSliderChange(values);
            }

            this.setState({
                values: values
            });
        });
    },

    shouldComponentUpdate (nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.values, nextState.values);
    },

    values () {
        return this.refs.sliderInputValues.value;
    },

    setValues (values) {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;
        document.getElementById(`${id}-slider`).noUiSlider.set(values);
    },

    render () {
        const fieldClass = classNames(
            'noUiSlider',
            {
                'input-field': !this.props.isHorizontal,
                'input-horizontal-field': this.props.isHorizontal,
                'row': this.props.isHorizontal
            }
        );

        const labelClass = classNames(
            {
                'col m3': this.props.isHorizontal
            }
        );

        const sliderClass = classNames(
            'noUiSlider-slider',
            {
                'col m9': this.props.isHorizontal
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

                <label className={labelClass}>
                    {this.props.title}
                </label>

                <div className={sliderClass}>
                    <div id={`${id}-slider`}/>
                    {
                        (this.props.isDisplayRange && this.state.values) &&
                        <div ref="sliderDisplayValues"
                             className="noUiSlider-values center-align">
                            {`${this.state.values[0] + this.props.unit} - ${this.state.values[1] + this.props.unit}`}
                        </div>
                    }
                </div>

                <input ref="sliderInputValues"
                       id={id}
                       name={name}
                       type="hidden"/>
            </div>
        );
    }
});

module.exports = RangeSlider;

