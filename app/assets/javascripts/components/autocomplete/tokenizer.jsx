'use strict';

const Token = require('./token');
const Typeahead = require('./typeahead');
const classNames = require('classnames');

var KeyEvent = KeyEvent || {};
KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;
KeyEvent.DOM_VK_TAB = KeyEvent.DOM_VK_TAB || 9;

function _arraysAreDifferent(array1, array2) {
    if (array1.length != array2.length) {
        return true;
    }
    for (var i = array2.length - 1; i >= 0; i--) {
        if (array2[i] !== array1[i]) {
            return true;
        }
    }
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
var TypeaheadTokenizer = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        options: React.PropTypes.array,
        customClasses: React.PropTypes.object,
        allowCustomValues: React.PropTypes.number,
        defaultSelected: React.PropTypes.array,
        defaultValue: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        inputProps: React.PropTypes.object,
        onTokenRemove: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onKeyUp: React.PropTypes.func,
        onTokenAdd: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        filterOption: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ]),
        displayOption: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ]),
        maxVisible: React.PropTypes.number,
        hasDefaultClassNames: React.PropTypes.bool
    },

    getInitialState () {
        return {
            // We need to copy this to avoid incorrect sharing
            // of state across instances (e.g., via getDefaultProps())
            selected: this.props.defaultSelected.slice(0)
        };
    },

    getDefaultProps () {
        return {
            options: [],
            defaultSelected: [],
            customClasses: {},
            allowCustomValues: 0,
            defaultValue: "",
            placeholder: "",
            inputProps: {},
            hasDefaultClassNames: true,
            filterOption: null,
            displayOption: (token) => { return token },
            onKeyDown: (event) => {},
            onKeyUp: (event) => {},
            onFocus: (event) => {},
            onBlur: (event) => {},
            onTokenAdd () {},
            onTokenRemove () {}
        };
    },

    componentWillReceiveProps (nextProps) {
        // if we get new defaultProps, update selected
        if (_arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)) {
            this.setState({selected: nextProps.defaultSelected.slice(0)})
        }
    },

    focus () {
        this.refs.typeahead.focus();
    },

    getSelectedTokens () {
        return this.state.selected;
    },

    _renderTokens () {
        var tokenClasses = {};
        tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
        var classList = classNames(tokenClasses);
        var result = this.state.selected.map(function (selected) {
            var displayString = selected;
            return (
                <Token key={ displayString } className={classList}
                       onRemove={ this._removeTokenForValue }
                       object={selected}
                       name={ this.props.name }>
                    { displayString }
                </Token>
            );
        }, this);
        return result;
    },

    _getOptionsForTypeahead () {
        // return this.props.options without this.selected
        return this.props.options;
    },

    _onKeyDown (event) {
        // We only care about intercepting backspaces
        if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
            return this._handleBackspace(event);
        }
        this.props.onKeyDown(event);
    },

    _handleBackspace (event) {
        // No tokens
        if (!this.state.selected.length) {
            return;
        }

        // Remove token ONLY when bksp pressed at beginning of line
        // without a selection
        var entry = this.refs.typeahead.refs.entry;
        if (entry.selectionStart == entry.selectionEnd &&
            entry.selectionStart == 0) {
            this._removeTokenForValue(
                this.state.selected[this.state.selected.length - 1]);
            event.preventDefault();
        }
    },

    _removeTokenForValue (value) {
        var index = this.state.selected.indexOf(value);
        if (index == -1) {
            return;
        }

        this.state.selected.splice(index, 1);
        this.setState({selected: this.state.selected});
        this.props.onTokenRemove(value);
    },

    _addTokenForValue (value, noSubmit) {
        var full_value = value;
        if(this.props.addTokenCondition) {
            if($.isEmpty(value[this.props.addTokenCondition])) {
                return;
            }

            value = value[this.props.addTokenCondition];
        }

        if (this.state.selected.indexOf(value) != -1) {
            return;
        }
        this.state.selected.push(value);
        this.setState({selected: this.state.selected});
        this.refs.typeahead.setEntryText("");
        this.props.onTokenAdd(full_value, noSubmit);
    },

    setEntryText (value) {
        this.refs.typeahead.setEntryText(value);
    },

    getEntryText () {
        return this.refs.typeahead.getEntryText();
    },

    render () {
        var classes = {};
        classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
        var classList = classNames(classes);
        var tokenizerClasses = [this.props.hasDefaultClassNames && "typeahead-tokenizer"];
        tokenizerClasses[this.props.className] = !!this.props.className;
        var tokenizerClassList = classNames(tokenizerClasses);

        return (
            <div className={tokenizerClassList}>
                { this._renderTokens() }
                <Typeahead ref="typeahead"
                           className={classList}
                           placeholder={this.props.placeholder}
                           inputProps={this.props.inputProps}
                           allowCustomValues={this.props.allowCustomValues}
                           customClasses={this.props.customClasses}
                           options={this._getOptionsForTypeahead()}
                           defaultValue={this.props.defaultValue}
                           maxVisible={this.props.maxVisible}
                           onOptionSelected={this._addTokenForValue}
                           onKeyDown={this._onKeyDown}
                           onKeyUp={this.props.onKeyUp}
                           onFocus={this.props.onFocus}
                           onBlur={this.props.onBlur}
                           displayOption={this.props.displayOption}
                           hasDefaultClassNames={this.props.hasDefaultClassNames}
                           filterOption={this.props.filterOption}/>
            </div>
        );
    }
});

module.exports = TypeaheadTokenizer;
