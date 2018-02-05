'use strict';

import _ from 'lodash';

import noUiSlider from 'materialize-css/extras/noUiSlider/nouislider';

export default class RangeSlider extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        range: PropTypes.array.isRequired,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        unit: PropTypes.string,
        icon: PropTypes.string,
        children: PropTypes.array,
        isHorizontal: PropTypes.bool,
        isDisplayRange: PropTypes.bool,
        hasInputForDefaultValues: PropTypes.bool,
        onSliderChange: PropTypes.func
    };

    static defaultProps = {
        isHorizontal: false,
        isDisplayRange: false,
        hasInputForDefaultValues: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        values: undefined
    };

    componentDidMount() {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        const sliderIdSelector = document.getElementById(`${id}-slider`);

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
                    this._sliderInputValues.value = values;
                } else {
                    this._sliderInputValues.value = null;
                }
            } else {
                this._sliderInputValues.value = values;
            }

            if (this.props.onSliderChange) {
                this.props.onSliderChange(values);
            }

            this.setState({
                values: values
            });
        });
    }

    shouldComponentUpdate(_, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.values, nextState.values);
    }

    values = () => {
        return this._sliderInputValues.value;
    };

    setValues = (values) => {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;
        document.getElementById(`${id}-slider`).noUiSlider.set(values);
    };

    render() {
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
                    <span className="material-icons prefix"
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }

                <label className={labelClass}>
                    {this.props.title}
                </label>

                <div className={sliderClass}>
                    <div id={`${id}-slider`}/>
                    {
                        (this.props.isDisplayRange && this.state.values) &&
                        <div className="noUiSlider-values center-align">
                            {`${this.state.values[0] + this.props.unit} - ${this.state.values[1] + this.props.unit}`}
                        </div>
                    }
                </div>

                <input ref={(sliderInputValues) => this._sliderInputValues = sliderInputValues}
                       id={id}
                       name={name}
                       type="hidden"/>
            </div>
        );
    }
}


