'use strict';

var TypeaheadOption = require('./option');
var classNames = require('classnames');

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
var TypeaheadSelector = React.createClass({
    displayName: "TypeaheadSelector",
    propTypes: {
        options: React.PropTypes.array,
        customClasses: React.PropTypes.object,
        customValue: React.PropTypes.string,
        selectionIndex: React.PropTypes.number,
        onOptionSelected: React.PropTypes.func,
        displayOption: React.PropTypes.func.isRequired,
        defaultClassNames: React.PropTypes.bool
    },

    getDefaultProps () {
        return {
            selectionIndex: null,
            customClasses: {},
            customValue: null,
            onOptionSelected (option) {
            },
            defaultClassNames: true
        };
    },

    _handleItemClick (result, event) {
        return this.props.onOptionSelected(result, event);
    },

    render () {
        let classes = {
            "typeahead-selector": this.props.defaultClassNames
        };
        classes[this.props.customClasses.results] = this.props.customClasses.results;
        let classList = classNames(classes);

        // CustomValue should be added to top of results list with different class name
        let customValue = null;
        let customValueOffset = 0;
        if (this.props.customValue !== null) {
            customValueOffset++;
            customValue = (
                React.createElement(TypeaheadOption, {
                        ref: this.props.customValue, key: this.props.customValue,
                        hover: this.props.selectionIndex === 0,
                        customClasses: this.props.customClasses,
                        customValue: this.props.customValue,
                        onClick: this._handleItemClick.bind(this, this.props.customValue)
                    },
                    this.props.customValue
                )
            );
        }

        let results = this.props.options.map(function (result, i) {
            let displayString = this.props.displayOption(result, i);
            let uniqueKey = (displayString.ref || displayString) + '_' + i;
            return (
                React.createElement(TypeaheadOption, {
                        ref: uniqueKey, key: uniqueKey,
                        hover: this.props.selectionIndex === i + customValueOffset,
                        customClasses: this.props.customClasses,
                        onClick: this._handleItemClick.bind(this, result)
                    },
                    displayString
                )
            );
        }, this);


        return (
            React.createElement("ul", {className: classList},
                customValue,
                results
            )
        );
    }
});

module.exports = TypeaheadSelector;
