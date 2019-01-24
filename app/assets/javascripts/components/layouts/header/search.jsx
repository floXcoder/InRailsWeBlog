'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import SearchIcon from '@material-ui/icons/Search';

import {
    fetchAutocomplete,
    setAutocompleteAction
} from '../../../actions';

import EnsureValidity from '../../modules/ensureValidity';

import styles from '../../../../jss/home/search';

export default @connect((state) => ({
    query: state.autocompleteState.query,
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId
}), {
    fetchAutocomplete,
    setAutocompleteAction
})

@withStyles(styles)
class HomeSearchHeader extends React.Component {
    static propTypes = {
        isSearchActive: PropTypes.bool.isRequired,
        onFocus: PropTypes.func.isRequired,
        // onClose: PropTypes.func.isRequired,
        // Fom connect
        query: PropTypes.string,
        currentUserId: PropTypes.number,
        currentUserTopicId: PropTypes.number,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteAction: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._searchInput = null;
    }

    state = {
        query: this.props.query || ''
    };

    componentDidUpdate(prevProps) {
        // On clear input (tag click, ...), set focus to continue searching
        if ((prevProps.isSearchActive !== this.props.isSearchActive && this.props.isSearchActive) || prevProps.query === '') {
            this._searchInput.focus();
        }
    }

    _handleChange = (event) => {
        const query = event.target.value;

        this.props.fetchAutocomplete({
            selectedTypes: ['article', 'tag', 'topic'],
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            limit: 6
        });

        this.setState({
            query
        })
    };

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (Utils.NAVIGATION_KEYMAP[event.which] === 'tab'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'enter'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'shift'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'escape'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'pageup'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'pagedown'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'meta') {
                event.preventDefault();

                // // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
                // if (event.keyCode !== 13) {
                //     return;
                // }

                this.props.setAutocompleteAction(event.key);
            }
        }
    };

    render() {
        return (
            <form className="blog-search-header"
                  autoComplete="off"
                  acceptCharset="UTF-8">
                <div>
                    <EnsureValidity/>

                    <div className={this.props.classes.search}>
                        <div className={this.props.classes.searchIcon}>
                            <SearchIcon/>
                        </div>

                        <Input inputRef={(input) => this._searchInput = input}
                               name="search"
                               type="search"
                               classes={{
                                   root: this.props.classes.inputRoot,
                                   input: this.props.isSearchActive ? this.props.classes.inputInputFocus : this.props.classes.inputInput
                               }}
                               placeholder={I18n.t('js.search.module.placeholder')}
                               disableUnderline={true}
                               value={this.state.query}
                               onFocus={this.props.onFocus}
                               onKeyDown={this._handleKeyDown}
                               onChange={this._handleChange}/>
                    </div>

                    <button className="search-header-submit"
                            type="submit"
                            name="action"/>

                    {/*<a className="search-header-close"*/}
                    {/*href="#"*/}
                    {/*onClick={this.props.onClose}>*/}
                    {/*<span className="material-icons"*/}
                    {/*data-icon="close"*/}
                    {/*aria-hidden="true"/>*/}
                    {/*</a>*/}
                </div>
            </form>
        );
    }
}
