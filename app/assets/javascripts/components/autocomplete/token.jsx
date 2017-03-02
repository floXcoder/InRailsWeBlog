'use strict';


/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
export default class Token extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        name: React.PropTypes.string,
        children: React.PropTypes.string,
        object: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        onRemove: React.PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        let className = classNames([
            "typeahead-token",
            this.props.className
        ]);

        return (
            <div className={className}>
                {this._renderHiddenInput()}
                {this.props.children}
                {this._renderCloseButton()}
            </div>
        );
    }

    _renderHiddenInput() {
        // If no name was set, don't create a hidden input
        if (!this.props.name) {
            return null;
        }

        return (
            <input
                type="hidden"
                name={ this.props.name + '[]' }
                value={ this.props.object }
            />
        );
    }

    _renderCloseButton() {
        if (!this.props.onRemove) {
            return "";
        }
        return (
            <a className="typeahead-token-close" href="#" onClick={(event) => {
                this.props.onRemove(this.props.object);
                event.preventDefault();
            }}>&#x00d7;</a>
        );
    }
}
