'use strict';

const classNames = require('classnames');

/**
 * A single option within the TypeaheadSelector
 */
var TypeaheadOption = React.createClass({
    displayName: "TypeaheadOption",
    propTypes: {
        customClasses: React.PropTypes.object,
        customValue: React.PropTypes.string,
        onClick: React.PropTypes.func,
        children: React.PropTypes.object,
        isOnHover: React.PropTypes.bool
    },

    getDefaultProps () {
        return {
            customClasses: {},
            onClick (event) {
                event.preventDefault();
            }
        };
    },

    _getClasses () {
        let classes = {
            "typeahead-option": true
        };
        classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;

        return classNames(classes);
    },

    _handleItemClick (event) {
        event.preventDefault();
        return this.props.onClick(event);
    },

    render () {
        let classes = {};
        classes[this.props.customClasses.hover || "hover"] = !!this.props.isOnHover;
        classes[this.props.customClasses.listItem] = !!this.props.customClasses.listItem;

        if (this.props.customValue) {
            classes[this.props.customClasses.customAdd] = !!this.props.customClasses.customAdd;
        }

        let classList = classNames(classes);

        return (
            React.createElement("li", {className: classList, onClick: this._handleItemClick},
                React.createElement("a", {href: "javascript: void 0;", className: this._getClasses(), ref: "anchor"},
                    this.props.children
                )
            )
        );
    }
});


module.exports = TypeaheadOption;
