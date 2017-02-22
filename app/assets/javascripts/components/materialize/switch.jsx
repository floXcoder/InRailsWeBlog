'use strict';

const classNames = require('classnames');

var Switch = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string,
        multipleId: React.PropTypes.number,
        values: React.PropTypes.shape({
            truthy: React.PropTypes.string,
            falsy: React.PropTypes.string
        }),
        title: React.PropTypes.string,
        isTitleDown: React.PropTypes.bool,
        titleClass: React.PropTypes.string,
        children: React.PropTypes.bool,
        isDisabled: React.PropTypes.bool,
        onSwitchChange: React.PropTypes.func,
        isHorizontal: React.PropTypes.bool,
        validator: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            name: null,
            multipleId: null,
            values: {},
            title: null,
            isTitleDown: false,
            titleClass: null,
            children: null,
            isDisabled: false,
            onCheckboxChanged: null,
            onSwitchChange: null,
            isHorizontal: false,
            validator: null
        };
    },

    getInitialState () {
        return {
            isChecked: this.props.children !== false
        };
    },

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.isDisabled != nextProps.isDisabled ||
            this.props.children != nextProps.children ||
            this.state.isChecked != nextState.children) {
            return true;
        } else {
            return false;
        }
    },

    value () {
        return this.state.isChecked;
    },

    _handleSwitchChange (event) {
        this.setState({isChecked: !this.state.isChecked});
        if (this.props.onSwitchChange) {
            this.props.onSwitchChange(!this.state.isChecked);
        }
        return event;
    },

    render () {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        const fieldClass = classNames('switch', {
            'input-horizontal-field': this.props.isHorizontal,
            'row': this.props.isHorizontal
        });

        const titleClass = classNames(
            this.props.titleClass,
            {
                'col m4': this.props.isHorizontal
            }
        );
        const labelClass = classNames({
            'col m8': this.props.isHorizontal
        });

        return (
            <div className={fieldClass}>
                {
                    (this.props.title && !this.props.isTitleDown) &&
                    <h6 className={titleClass}>
                        {this.props.title}
                    </h6>
                }

                <label className={labelClass}>
                    {this.props.values.falsy}

                    <input ref={this.props.id}
                           id={id}
                           name={name}
                           type="checkbox"
                           disabled={this.props.isDisabled}
                           checked={this.state.isChecked}
                           value={this.state.isChecked ? '1' : '0'}
                           data-unchecked-value="0"
                           onChange={this._handleSwitchChange}
                        {...this.props.validator}/>

                    <span className="lever"/>

                    {this.props.values.truthy}
                </label>

                {
                    (this.props.title && this.props.isTitleDown) &&
                    <h6 className={titleClass}>
                        {this.props.title}
                    </h6>
                }
            </div>
        );
    }
});

module.exports = Switch;
