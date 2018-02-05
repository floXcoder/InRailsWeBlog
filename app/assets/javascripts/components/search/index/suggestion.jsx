'use strict';

export default class SearchSuggestionIndex extends React.Component {
    static propTypes = {
        suggestions: PropTypes.array.isRequired,
        onSuggestionClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleSuggestionClick = (suggestion, event) => {
        event.preventDefault();

        this.props.onSuggestionClick(suggestion);
    };

    render() {
        if (this.props.suggestions.length === 0) {
            return null;
        }

        return (
            <div className="search-index-category">
                <div className="search-suggestion">
                    {
                        this.props.suggestions.map((suggestion) => (
                            <a key={suggestion}
                               className="btn-small waves-effect waves-light"
                               href="#"
                               onClick={this._handleSuggestionClick.bind(this, suggestion)}>
                                {suggestion}
                            </a>
                        ))
                    }
                </div>
            </div>
        );
    }
}
