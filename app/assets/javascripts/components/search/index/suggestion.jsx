'use strict';

export default class SearchSuggestionIndex extends React.PureComponent {
    static propTypes = {
        articleSuggestions: PropTypes.array.isRequired,
        tagSuggestions: PropTypes.array.isRequired,
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
        if (Utils.isEmpty(this.props.articleSuggestions) && Utils.isEmpty(this.props.tagSuggestions)) {
            return null;
        }

        return (
            <div className="search-index-category">
                {
                    Utils.isPresent(this.props.tagSuggestions) &&
                    <div className="search-suggestion">
                        {I18n.t('js.search.index.suggestions.tags')}
                        {
                            this.props.tagSuggestions.map((suggestion) => (
                                <a key={suggestion}
                                   className="search-suggestion-tag"
                                   href="#"
                                   onClick={this._handleSuggestionClick.bind(this, suggestion)}>
                                    {suggestion}
                                </a>
                            ))
                        }
                    </div>
                }

                {
                    Utils.isPresent(this.props.articleSuggestions) &&
                    <div className="search-suggestion">
                        {I18n.t('js.search.index.suggestions.articles')}
                        {
                            this.props.articleSuggestions.map((suggestion) => (
                                <a key={suggestion}
                                   className="search-suggestion-article"
                                   href="#"
                                   onClick={this._handleSuggestionClick.bind(this, suggestion)}>
                                    {suggestion}
                                </a>
                            ))
                        }
                    </div>
                }
            </div>
        );
    }
}
