import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    taggedArticlesPath,
    userArticlePath,
    searchPath,
    searchParam
} from '@js/constants/routesHelper';

import {
    setAutocompleteQuery,
    fetchAutocomplete,
    setAutocompleteAction,
    setAutocompleteSelectedTag
} from '@js/actions/searchActions';

import {
    maxSearchRate,
    autocompleteLimit
} from '@js/components/modules/constants';

import withRouter from '@js/components/modules/router';


class HomeSearchHeader extends React.Component {
    static propTypes = {
        isSearchActive: PropTypes.bool.isRequired,
        // from router
        routeLocation: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        query: PropTypes.string,
        currentUserId: PropTypes.number,
        currentUserTopicId: PropTypes.number,
        selectedTags: PropTypes.array,
        highlightedTag: PropTypes.object,
        highlightedArticle: PropTypes.object,
        setAutocompleteQuery: PropTypes.func,
        fetchAutocomplete: PropTypes.func,
        setAutocompleteAction: PropTypes.func,
        setAutocompleteSelectedTag: PropTypes.func
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

                    this.props.setAutocompleteAction(event.key, this.props.currentUserId, this.props.currentUserTopicId);

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
        if (this.props.routeLocation.hash !== '#search') {
            this.props.routeNavigate({
                hash: searchParam
            });
        }
    };

    _goToTag = (tag) => {
        this.props.routeNavigate({
            pathname: taggedArticlesPath(tag.slug),
            hash: searchParam
        });
    };

    _goToArticle = (article) => {
        this.props.routeNavigate({
            pathname: userArticlePath(article.userSlug, article.slug),
            hash: undefined
        });
    };

    _performSearch = () => {
        if (!this.props.query || this.props.query === '') {
            return;
        }

        this.props.setAutocompleteSelectedTag();

        this.props.routeNavigate({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _handleSearchClose = () => {
        if (this.props.routeLocation.hash === '#search') {
            this.props.routeNavigate({
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
                    <meta itemProp="target"
                          content={`${window.websiteUrl}/search?query={search}`}/>

                    <div className="search-header-search">
                        <div className="search-header-search-icon">
                            <SearchIcon/>
                        </div>

                        <InputLabel className="search-header-input-label"
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
                                   root: 'search-header-input-root',
                                   input: this.props.isSearchActive ? 'search-header-input-input-focus' : 'search-header-input-input'
                               }}
                               placeholder={I18n.t('js.search.module.placeholder')}
                               disableUnderline={true}
                               value={this.props.query}
                               startAdornment={
                                   <InputAdornment position="start">
                                       {
                                           this.props.selectedTags.map((tag) => (
                                               <Chip key={tag.id}
                                                     className="search-header-selected-tags-chip"
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

export default connect((state) => ({
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
})(withRouter({
    location: true,
    navigate: true
})(HomeSearchHeader));
