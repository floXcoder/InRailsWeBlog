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
    setAutocompleteSelectedTag
} from '../../actions';

import {
    getUserRecentTags,
    getUserRecentArticles,
    getAutocompleteSelectedTags,
    getAutocompleteTags,
    getAutocompleteArticles
} from '../../selectors';

import Loader from '../theme/loader';

import SearchTagModule from './module/tag';
import SearchArticleModule from './module/article';

import styles from '../../../jss/search/module';

export default @connect((state) => ({
    currentTopicId: state.topicState.currentUserTopicId,
    recentTags: getUserRecentTags(state),
    recentArticles: getUserRecentArticles(state),
    isSearching: state.autocompleteState.isFetching,
    query: state.autocompleteState.query,
    actionKey: state.autocompleteState.actionKey,
    highlightedTagId: state.autocompleteState.highlightedTagId,
    tags: getAutocompleteTags(state),
    selectedTags: getAutocompleteSelectedTags(state),
    articles: getAutocompleteArticles(state)
}), {
    setAutocompleteSelectedTag
})
@hot(module)
@withStyles(styles)
class SearchModule extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // from connect
        currentTopicId: PropTypes.number,
        recentTags: PropTypes.array,
        recentArticles: PropTypes.array,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        actionKey: PropTypes.string,
        highlightedTagId: PropTypes.number,
        setAutocompleteSelectedTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.actionKey !== this.props.actionKey) {
            if (this.props.actionKey === 'Enter') {
                this._performSearch();
            } else if (this.props.actionKey === 'Escape') {
                this._handleSearchClose();
            }
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleTagSelection = (tag) => {
        this.props.setAutocompleteSelectedTag(tag);
    };

    _performSearch = () => {
        this.props.history.push({
            pathname: '/search',
            search: $.param(Utils.compact({
                query: this.props.query,
                tags: this.props.selectedTags.map((tag) => tag.slug)
            }))
        });
    };

    _handleSearchClose = () => {
        this.props.history.push({
            hash: undefined
        });
    };

    render() {
        const hasQuery = (this.props.query && this.props.query !== '') || this.props.selectedTags.length > 0;
        const tags = hasQuery ? this.props.tags : _.uniqBy(this.props.recentTags, (tag) => tag.name);
        const articles = hasQuery ? this.props.articles : _.uniqBy(this.props.recentArticles, (article) => article.title);

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
                        (this.props.query !== '' && this.props.selectedTags.length === 0) &&
                        <div className={classNames(this.props.classes.helpMessage, 'center-align')}>
                            {I18n.t('js.search.module.helpers.select_tag')}
                        </div>
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
                                             currentTopicId={this.props.currentTopicId}
                                             hasQuery={hasQuery}
                                             tags={tags}
                                             selectedTags={this.props.selectedTags}
                                             highlightedTagId={this.props.highlightedTagId}
                                             onTagClick={this._handleTagSelection}/>
                        </Grid>

                        <Grid item={true}
                              xs={12}
                              sm={6}
                              lg={9}>
                            <SearchArticleModule classes={this.props.classes}
                                                 currentTopicId={this.props.currentTopicId}
                                                 hasQuery={hasQuery}
                                                 selectedTags={this.props.selectedTags}
                                                 articles={articles}/>
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
