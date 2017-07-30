'use strict';

import _ from 'lodash';

export default class Textarea extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        placeholder: React.PropTypes.string,
        children: React.PropTypes.string,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        isHorizontal: React.PropTypes.bool,
        isRequired: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        icon: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        onChange: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        characterCount: React.PropTypes.number,
        validator: React.PropTypes.object
    };

    static defaultProps = {
        title: null,
        name: null,
        multipleId: null,
        placeholder: null,
        children: null,
        isHorizontal: false,
        isRequired: false,
        isDisabled: false,
        icon: null,
        minLength: null,
        maxLength: null,
        onChange: null,
        onKeyDown: null,
        onBlur: null,
        characterCount: null,
        validator: null
    };

    state = {
        hasValue: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.characterCount) {
            const $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
            $currentElement.attr('length', this.props.characterCount);
            // $currentElement.characterCounter();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state.hasValue, nextState.hasValue) || this.props.children !== nextProps.children;
    }

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

        const fieldClass = classNames({
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
                        <i className={iconClass}>{this.props.icon}</i>
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
                              placeholder={this.props.placeholder}
                              required={this.props.isRequired}
                              disabled={this.props.isDisabled}
                              minLength={this.props.minLength}
                              maxLength={this.props.maxLength}
                              onChange={this.props.onChange}
                              onKeyDown={this.props.onKeyDown}
                              onBlur={this.props.onBlur}
                              defaultValue={this.props.children}
                              {...this.props.validator}/>

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

