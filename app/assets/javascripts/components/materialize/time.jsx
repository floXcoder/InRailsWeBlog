'use strict';

import '../../modules/clockpicker';

export default class Time extends React.PureComponent {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        children: React.PropTypes.string,
        isDisabled: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        icon: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onInput: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object
    };

    static defaultProps = {
        children: null,
        isDisabled: false,
        name: null,
        multipleId: null,
        isRequired: false,
        icon: null,
        onChange: null,
        onInput: null,
        isHorizontal: false,
        validator: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs[this.props.id])).pickatime({
            default: this.props.children,
            donetext: I18n.t('js.date.buttons.apply'),
            autoclose: true,
            darktheme: true,
            twelvehour: false
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Ignore if props has changed
        return false;
    }

    render() {
        const fieldClass = classNames({
            'input-field': !this.props.isHorizontal,
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const labelClass = classNames({
            active: !!this.props.children,
            'col m4': this.props.isHorizontal
        });

        const inputClass = classNames(
            'timepicker',
            {
                'col m8': this.props.isHorizontal
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

                <label htmlFor={this.props.id}
                       className={labelClass}>
                    {this.props.title}
                </label>

                <input ref={this.props.id}
                       id={id}
                       name={name}
                       className={inputClass}
                       type="time"
                       disabled={this.props.isDisabled}
                       required={this.props.isRequired}
                       onInput={this.props.onInput}
                       onChange={this.props.onChange}
                       defaultValue={this.props.children}
                       {...this.props.validator}/>
            </div>
        );
    }
}

