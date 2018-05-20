'use strict';

import {
    fetchAutocomplete,
    setAutocompleteAction
} from '../../../actions';

@connect((state) => ({
    query: state.autocompleteState.query
}), {
    fetchAutocomplete,
    setAutocompleteAction
})
export default class HomeSearchHeader extends React.Component {
    static propTypes = {
        hasSearch: PropTypes.bool.isRequired,
        onFocus: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        // Fom connect
        query: PropTypes.string,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteAction: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._searchInput = null;
    }

    state = {
        value: ''
    };

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.query === '') {
            return {
                value: ''
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        // On clear input (tag click, ...), set focus to continue searching
        if ((prevProps.hasSearch !== this.props.hasSearch && this.props.hasSearch) || prevProps.query === '') {
            this._searchInput.focus();
        }
    }

    _handleChange = (event) => {
        const value = event.target.value;

        this.setState({
            value
        });

        this.props.fetchAutocomplete({
            selectedTypes: ['article', 'tag', 'topic'],
            query: value,
            limit: 6
        });
    };

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            event.preventDefault();

            // // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
            // if (event.keyCode !== 13) {
            //     return;
            // }

            this.props.setAutocompleteAction(event.key);
        }
    };

    render() {
        return (
            <form className="blog-search-header">
                <div className={classNames(
                    'search-header',
                    {
                        'has-focus': this.props.hasSearch
                    })}>
                    <input ref={(input) => this._searchInput = input}
                           type="search"
                           placeholder={I18n.t('js.search.module.placeholder')}
                           onFocus={this.props.onFocus}
                           onKeyDown={this._handleKeyDown}
                           onChange={this._handleChange}
                           value={this.state.value}/>

                    <a className="search-header-button"
                       href="/">
                        <span className="material-icons"
                              data-icon="search"
                              aria-hidden="true"/>
                    </a>

                    <a className="search-header-close"
                       href="#"
                       onClick={this.props.onClose}>
                        <span className="material-icons"
                              data-icon="close"
                              aria-hidden="true"/>
                    </a>
                </div>
            </form>
        );
    }
}
