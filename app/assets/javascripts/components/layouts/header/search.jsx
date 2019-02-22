'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';

import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    setAutocompleteQuery,
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteSelectedTag
} from '../../../actions';

import {
    getAutocompleteSelectedTags
} from '../../../selectors';

import {
    autocompleteLimit
} from '../../modules/constants';

import EnsureValidity from '../../modules/ensureValidity';

import styles from '../../../../jss/home/search';

export default @withRouter
@connect((state) => ({
    query: state.autocompleteState.query,
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId,
    selectedTags: getAutocompleteSelectedTags(state)
}), {
    setAutocompleteQuery,
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteSelectedTag
})
@withStyles(styles)
class HomeSearchHeader extends React.Component {
    static propTypes = {
        isSearchActive: PropTypes.bool.isRequired,
        // from router
        location: PropTypes.object,
        history: PropTypes.object,
        // Fom connect
        query: PropTypes.string,
        currentUserId: PropTypes.number,
        currentUserTopicId: PropTypes.number,
        selectedTags: PropTypes.array,
        setAutocompleteQuery: PropTypes.func,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteAction: PropTypes.func,
        setAutocompleteSelectedTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(document).keyup((event) => {
            if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                this._handleSearchClose();
            }
        });
    }

    _handleSearchOpen = () => {
        if (this.props.location.hash !== '#search') {
            this.props.history.push({
                hash: 'search'
            });
        }
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    _handleChange = (event) => {
        const query = event.target.value;

        this.props.setAutocompleteQuery(query);

        this.props.fetchAutocomplete({
            // selectedTypes: ['article', 'tag', 'topic'],
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            tags: this.props.selectedTags.map((tag) => tag.slug),
            limit: autocompleteLimit
        });
    };

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (this.props.query.length > 0 &&
                Utils.NAVIGATION_KEYMAP[event.which] === 'tab'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'enter'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'shift'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'escape'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'up'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'down'
                || Utils.NAVIGATION_KEYMAP[event.which] === 'meta') {
                event.preventDefault();

                // // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
                // if (event.keyCode !== 13) {
                //     return;
                // }

                this.props.setAutocompleteAction(event.key);
            } else if (this.props.query.length === 0 && this.props.selectedTags.length > 0 &&
                Utils.NAVIGATION_KEYMAP[event.which] === 'backspace') {
                event.preventDefault();

                this.props.setAutocompleteAction(event.key);
            }
        }
    };

    _handleTagSelection = (tag) => {
        this.props.setAutocompleteSelectedTag(tag);
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

                        <Input name="search"
                               type="search"
                               classes={{
                                   root: this.props.classes.inputRoot,
                                   input: this.props.isSearchActive ? this.props.classes.inputInputFocus : this.props.classes.inputInput
                               }}
                               placeholder={I18n.t('js.search.module.placeholder')}
                               disableUnderline={true}
                               value={this.props.query}
                               startAdornment={
                                   <InputAdornment position="start">
                                       {
                                           this.props.selectedTags.map((tag) => (
                                               <Chip key={tag.id}
                                                     className={this.props.classes.selectedTagsChip}
                                                     tabIndex={-1}
                                                     label={tag.name}
                                                     color="primary"
                                                     variant="outlined"
                                                     deleteIcon={<CancelIcon/>}
                                                     onClick={this._handleTagSelection.bind(this, tag)}
                                                     onDelete={this._handleTagSelection.bind(this, tag)}/>
                                           ))
                                       }
                                   </InputAdornment>
                               }
                               onFocus={this._handleSearchOpen}
                               onKeyDown={this._handleKeyDown}
                               onChange={this._handleChange}/>
                    </div>

                    <button className="search-header-submit"
                            type="submit"
                            name="action"/>
                </div>
            </form>
        );
    }
}
