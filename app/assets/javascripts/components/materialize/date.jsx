'use strict';

export default class Date extends React.PureComponent {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.string,
        isDisabled: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        icon: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onInput: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object
    };

    static defaultProps = {
        children: null,
        isDisabled: false,
        isRequired: false,
        name: null,
        multipleId: null,
        icon: null,
        autoComplete: null,
        onChange: null,
        onInput: null,
        isHorizontal: false,
        validator: null
    };

    state = {
        dateSelected: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        $(ReactDOM.findDOMNode(this.refs[this.props.id])).pickadate({
            hiddenSuffix: name,
            format: I18n.t('js.date.formats.date'),
            formatSubmit: I18n.t('js.date.formats.date'),
            closeOnSelect: true,
            closeOnClear: true,
            firstDay: 1,
            selectMonths: true,
            selectYears: 3,
            labelMonthPrev: I18n.t('js.date.ranges.previous_month'),
            labelMonthNext: I18n.t('js.date.ranges.next_month'),
            labelMonthSelect: I18n.t('js.date.ranges.select_month'),
            labelYearSelect: I18n.t('js.date.ranges.select_year'),
            monthsFull: I18n.t('js.date.month_names'),
            monthsShort: I18n.t('js.date.abbr_month_names'),
            weekdaysFull: I18n.t('js.date.day_names'),
            weekdaysShort: I18n.t('js.date.abbr_day_names'),
            weekdaysLetter: I18n.t('js.date.letter_day_names'),
            today: I18n.t('js.date.ranges.today_short'),
            clear: I18n.t('js.date.buttons.clear'),
            close: I18n.t('js.date.buttons.close'),
            onSet: (context) => {
                if (!$.isEmpty(context)) {
                    this.setState({
                        dateSelected: true
                    })
                }
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.dateSelected, nextState.dateSelected);
    }

    _handleFocus = (event) => {
        event.preventDefault();
        event.stopPropagation();

        $(ReactDOM.findDOMNode(this.refs[this.props.id])).pickadate('picker').open();
    };

    render() {
        const fieldClass = classNames({
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames({
            active: !!this.props.children || this.state.dateSelected,
            'col m4': this.props.isHorizontal
        });

        const inputClass = classNames(
            'datepicker',
            {
                'col m8': this.props.isHorizontal
            }
        );

        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        return (
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                <label htmlFor={this.props.id}
                       className={labelClass}>
                    {this.props.title}
                </label>

                <input ref={this.props.id}
                       id={id}
                       className={inputClass}
                       type="date"
                       disabled={this.props.isDisabled}
                       required={this.props.isRequired}
                       onFocus={this._handleFocus}
                       onInput={this.props.onInput}
                       onChange={this.props.onChange}
                       data-value={this.props.children}
                       {...this.props.validator}/>
            </div>
        );
    }
}

