'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';

import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    taggedArticlesPath,
    userArticlePath,
    searchPath,
    searchParam
} from '../../../constants/routesHelper';

import {
    setAutocompleteQuery,
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteSelectedTag
} from '../../../actions';

import {
    maxSearchRate,
    autocompleteLimit
} from '../../modules/constants';

import EnsureValidity from '../../modules/ensureValidity';

import styles from '../../../../jss/home/search';

export default @withRouter
@connect((state) => ({
    query: state.autocompleteState.query,
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId,
    selectedTags: state.autocompleteState.selectedTags,
    highlightedTag: state.autocompleteState.highlightedTag,
    highlightedArticle: state.autocompleteState.highlightedArticle
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
        highlightedTag: PropTypes.object,
        highlightedArticle: PropTypes.object,
        setAutocompleteQuery: PropTypes.func,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteAction: PropTypes.func,
        setAutocompleteSelectedTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    componentWillUnmount() {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        this._handleFetch.cancel();
    }

    _handleChange = (event) => {
        const query = event.target.value;

        this.props.setAutocompleteQuery(query);

        this._handleFetch(query);
    };

    _handleFetch = Utils.debounce((query) => {
        if (this._request?.signal) {
            this._request.signal.abort();
        }

        this._request = this.props.fetchAutocomplete({
            // selectedTypes: ['article', 'tag', 'topic'],
            query: query,
            userId: this.props.currentUserId,
            topicId: this.props.currentUserTopicId,
            tagIds: this.props.selectedTags.map((tag) => tag.id),
            limit: autocompleteLimit
        });
    }, maxSearchRate);

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (this.props.query.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'tab'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'enter'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'escape'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'shift'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'up'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'down'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'meta') {
                    event.preventDefault();

                    // // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
                    // if (event.keyCode !== 13) {
                    //     return;
                    // }

                    this.props.setAutocompleteAction(event.key);

                    if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
                        if (this.props.highlightedTag) {
                            this._goToTag(this.props.highlightedTag);
                        } else if (this.props.highlightedArticle) {
                            this._goToArticle(this.props.highlightedArticle);
                        } else {
                            this._performSearch();
                        }
                    } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                        this._handleSearchClose();
                    }
                }
            } else if (this.props.query.length === 0) {
                if (this.props.selectedTags.length > 0 &&
                    Utils.NAVIGATION_KEYMAP[event.which] === 'backspace') {
                    event.preventDefault();

                    this.props.setAutocompleteAction(event.key);
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
                    event.preventDefault();
                }
            }
        }
    };

    _handleTagSelection = (tag) => {
        this.props.setAutocompleteSelectedTag(tag);
    };

    _handleSearchOpen = () => {
        if (this.props.location.hash !== '#search') {
            this.props.history.push({
                hash: searchParam
            });
        }
    };

    _goToTag = (tag) => {
        this.props.history.push({
            pathname: taggedArticlesPath(tag.slug),
            hash: searchParam
        });
    };

    _goToArticle = (article) => {
        this.props.history.push({
            pathname: userArticlePath(article.user.slug, article.slug),
            hash: undefined
        });
    };

    _performSearch = () => {
        if(!this.props.query || this.props.query === '') {
            return;
        }

        this.props.setAutocompleteSelectedTag();

        this.props.history.push({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    render() {
        return (
            <section itemScope={true}
                     itemType="https://schema.org/WebSite">
                <meta itemProp="url"
                      content={window.websiteUrl}/>

                <form className="blog-search-header"
                      autoComplete="off"
                      acceptCharset="UTF-8"
                      itemProp="potentialAction"
                      itemScope={true}
                      itemType="https://schema.org/SearchAction">
                    <EnsureValidity/>

                    <meta itemProp="target"
                          content={`${window.websiteUrl}/search?query={search}`}/>

                    <div className={this.props.classes.search}>
                        <div className={this.props.classes.searchIcon}>
                            <SearchIcon/>
                        </div>

                        <InputLabel className={this.props.classes.inputLabel}
                                    htmlFor="search-module">
                            Search
                        </InputLabel>

                        <Input id="search-module"
                               name="search"
                               type="search"
                               inputProps={{
                                   itemProp: 'query-input'
                               }}
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

                    <button style={{display: 'none'}}
                            type="submit"
                            name="action">
                        Search
                    </button>
                </form>
            </section>
        );
    }
}
