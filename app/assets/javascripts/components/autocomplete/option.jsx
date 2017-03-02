'use strict';


/**
 * A single option within the TypeaheadSelector
 */
export default class TypeaheadOption extends React.Component {
    static propTypes = {
        customClasses: React.PropTypes.object,
        customValue: React.PropTypes.string,
        onClick: React.PropTypes.func,
        children: React.PropTypes.object,
        isOnHover: React.PropTypes.bool
    };

    static defaultProps = {
        customClasses: {},
        onClick (event) {
            event.preventDefault();
        }
    };

    constructor(props) {
        super(props);
    }

    _getClasses() {
        let classes = {
            "typeahead-option": true
        };
        classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;

        return classNames(classes);
    }

    _handleItemClick(event) {
        event.preventDefault();
        return this.props.onClick(event);
    }

    render() {
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
}


export default TypeaheadOption;
