'use strict';

import TypeaheadOption from './option';

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
export default class TypeaheadSelector extends React.Component {
    static propTypes = {
        options: PropTypes.array,
        customClasses: PropTypes.object,
        customValue: PropTypes.string,
        selectionIndex: PropTypes.number,
        onOptionSelected: PropTypes.func,
        displayOption: PropTypes.func.isRequired,
        hasDefaultClassNames: PropTypes.bool
    };

    static defaultProps = {
        customClasses: {},
        onOptionSelected (option) {
        },
        hasDefaultClassNames: true
    };

    constructor(props) {
        super(props);
    }

    _handleItemClick = (result, event) => {
        return this.props.onOptionSelected(result, event);
    };

    render() {
        let classes = {
            "typeahead-selector": this.props.hasDefaultClassNames
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

        let results = this.props.options.map((result, i) => {
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
}
