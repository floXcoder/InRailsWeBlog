'use strict';

import _ from 'lodash';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import CloseIcon from '@material-ui/icons/Close';

import {
    setSelectedTag
} from '../../actions';

import {
    getUserRecentTags,
    getUserRecentArticles,
    getSelectedTags,
    getAutocompleteTags,
    getAutocompleteArticles
} from '../../selectors';

import Loader from '../theme/loader';

// import SearchSelectedModule from './module/selected';
import SearchTagModule from './module/tag';
import SearchArticleModule from './module/article';

import styles from '../../../jss/search/module';

export default @hot(module)

@connect((state) => ({
    recentTags: getUserRecentTags(state),
    recentArticles: getUserRecentArticles(state),
    isSearching: state.autocompleteState.isFetching,
    query: state.autocompleteState.query,
    actionKey: state.autocompleteState.actionKey,
    tags: getAutocompleteTags(state),
    selectedTags: getSelectedTags(state),
    articles: getAutocompleteArticles(state)
}), {
    setSelectedTag
})
@withStyles(styles)
class SearchModule extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // from connect
        recentTags: PropTypes.array,
        recentArticles: PropTypes.array,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        actionKey: PropTypes.string,
        setSelectedTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    state = {
        highlightedTagIndex: undefined
    };

    componentDidUpdate(prevProps) {
        if (this.props.query !== prevProps.query) {
            this._resetTagSelection();
        }

        if (this.props.actionKey && this.props.actionKey !== ' ') {
            if (this._handleKeyAction()[this.props.actionKey]) {
                this._handleKeyAction()[this.props.actionKey].call(this, this.props.actionKey);
            }
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleKeyAction = () => {
        return {
            ArrowDown() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === this.props.tags.length - 1)
                        ? 0
                        : highlightedTagIndex + 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            ArrowUp() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === 0)
                        ? this.props.tags.length - 1
                        : highlightedTagIndex - 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            Enter() {
                if (this.state.highlightedTagIndex !== undefined) {
                    this._handleTagSelection(this.props.tags[this.state.highlightedTagIndex]);
                } else {
                    this._performSearch();
                }
            },

            Tab() {
                this._handleTagSelection(this.props.tags[0]);
            },

            Escape() {
                this._resetTagSelection();

                this._handleSearchClose();
            }
        }
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);
    };

    _resetTagSelection = () => {
        this.setState({
            highlightedTagIndex: undefined
        });
    };

    _performSearch = () => {
        this.props.history.push({
            pathname: '/search',
            search: $.param(Utils.compact({
                query: this.props.query,
                tagIds: this.props.selectedTags.map((tag) => tag.id)
            }))
        });
    };

    _handleSearchClose = () => {
        this.props.history.push({
            hash: undefined
        });
    };

    render() {
        const tags = this.props.query && this.props.query.length > 0 ? this.props.tags : _.uniqBy(this.props.recentTags, (tag) => tag.name);
        const articles = this.props.query && this.props.query.length > 0 ? this.props.articles : _.uniqBy(this.props.recentArticles, (article) => article.title);

        return (
            <Paper className="search-module-results"
                   square={true}
                   elevation={4}>
                {
                    this.props.isSearching &&
                    <div className="search-module-searching">
                        <Loader size="big"/>
                    </div>
                }

                <div className="search-module-close show-on-small">
                    <IconButton aria-expanded={true}
                                aria-label="Close"
                                onClick={this._handleSearchClose}>
                        <CloseIcon color="primary"
                                   fontSize="large"/>
                    </IconButton>
                </div>

                <div className={this.props.classes.container}>
                    {
                        // this.props.selectedTags.length > 0 &&
                        // <SearchSelectedModule classes={this.props.classes}
                        //                       selectedTags={this.props.selectedTags}
                        //                       onTagClick={this._handleTagSelection}/>
                    }

                    <Grid container={true}
                          spacing={32}
                          direction="row-reverse"
                          justify="space-between"
                          alignItems="flex-start">
                        <Grid item={true}
                              xs={12}
                              sm={6}
                              lg={3}>
                            <SearchTagModule classes={this.props.classes}
                                             tags={tags}
                                             hasQuery={!this.props.query}
                                             selectedTags={this.props.selectedTags}
                                             highlightedTagIndex={this.state.highlightedTagIndex}
                                             onTagClick={this._handleTagSelection}/>
                        </Grid>

                        <Grid item={true}
                              xs={12}
                              sm={6}
                              lg={9}>
                            <SearchArticleModule classes={this.props.classes}
                                                 articles={articles}
                                                 hasQuery={!this.props.query}/>
                        </Grid>
                    </Grid>

                    <div className="center-align">
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={this._performSearch}>
                            {I18n.t('js.search.module.button')}
                        </Button>
                    </div>
                </div>
            </Paper>
        );
    }
}
