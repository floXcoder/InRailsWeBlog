'use strict';

import _ from 'lodash';

export default class Textarea extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
        className: PropTypes.string,
        placeholder: PropTypes.string,
        children: PropTypes.string,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        isHorizontal: PropTypes.bool,
        isRequired: PropTypes.bool,
        isDisabled: PropTypes.bool,
        icon: PropTypes.string,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        onChange: PropTypes.func,
        onKeyDown: PropTypes.func,
        onBlur: PropTypes.func,
        characterCount: PropTypes.number
    };

    static defaultProps = {
        isHorizontal: false,
        isRequired: false,
        isDisabled: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        hasValue: false
    };

    // componentDidMount() {
    //     if (this.props.characterCount) {
    //         const $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
    //         $currentElement.attr('length', this.props.characterCount);
    //         // $currentElement.characterCounter();
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.hasValue, nextState.hasValue) || this.props.children !== nextProps.children;
    }

    _handleChange = (event) => {
        const value = event.target.value;

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    value = () => {
        return this.refs[this.props.id].value;
    };

    setValue = (value) => {
        this.refs[this.props.id].value = value;

        if (!this.state.hasValue) {
            this.setState({
                hasValue: true
            });
        }
    };

    focus = () => {
        this.refs[this.props.id].focus();
    };

    autoResize = () => {
        $(ReactDOM.findDOMNode(this.refs[this.props.id])).trigger('autoresize');
    };

    render() {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        const fieldClass = classNames(
            this.props.className,
            {
                'input-field': !this.props.isHorizontal,
                'input-horizontal-field': this.props.isHorizontal,
                'required-field': this.props.isRequired,
                'col s12': !this.props.isHorizontal
            });

        const iconClass = classNames(
            'material-icons',
            'prefix',
            {
                active: !!this.props.children || this.state.hasValue || this.props.placeholder
            }
        );

        const labelClass = classNames(
            {
                active: !!this.props.children || this.state.hasValue || this.props.placeholder,
                'col m4': this.props.isHorizontal
            }
        );

        const textareaClass = classNames(
            'materialize-textarea',
            'validate',
            {
                'col m8': this.props.isHorizontal
            }
        );

        return (
            <div className="row margin-bottom-0">
                <div className={fieldClass}>
                    {
                        this.props.icon &&
                        <span className={iconClass}
                              data-icon={this.props.icon}
                              aria-hidden="true"/>
                    }

                    {
                        (this.props.title && this.props.isHorizontal) &&
                        <label htmlFor={this.props.id}
                               className={labelClass}>
                            {this.props.title}
                        </label>
                    }

                    <textarea ref={this.props.id}
                              id={id}
                              name={name}
                              className={textareaClass}
                              length={this.props.characterCount}
                              placeholder={this.props.placeholder}
                              required={this.props.isRequired}
                              disabled={this.props.isDisabled}
                              minLength={this.props.minLength}
                              maxLength={this.props.maxLength}
                              onChange={this._handleChange}
                              onKeyDown={this.props.onKeyDown}
                              onBlur={this.props.onBlur}
                              defaultValue={this.props.children}/>

                    {
                        (this.props.title && !this.props.isHorizontal) &&
                        <label htmlFor={this.props.id}
                               className={labelClass}>
                            {this.props.title}
                        </label>
                    }
                </div>
            </div>
        );
    }
}

