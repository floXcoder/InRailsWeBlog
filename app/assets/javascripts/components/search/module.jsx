'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import CloseIcon from '@material-ui/icons/Close';

import {
    searchPath
} from '../../constants/routesHelper';

import {
    SearchIndex
} from '../loaders/components';

import {
    setAutocompleteSelectedTag
} from '../../actions';

import {
    getUserRecentTags,
    getUserRecentArticles
} from '../../selectors';

import Loader from '../theme/loader';

import SearchTopicModule from './module/topic';
import SearchTagModule from './module/tag';
import SearchArticleModule from './module/article';

import styles from '../../../jss/search/module';

export default @withRouter
@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentTopicId: state.topicState.currentUserTopicId,
    recentTags: getUserRecentTags(state),
    recentArticles: getUserRecentArticles(state),
    isSearching: state.autocompleteState.isFetching,
    query: state.autocompleteState.query,
    highlightedTag: state.autocompleteState.highlightedTag,
    highlightedArticle: state.autocompleteState.highlightedArticle,
    topics: state.autocompleteState.topics,
    tags: state.autocompleteState.tags,
    selectedTags: state.autocompleteState.selectedTags,
    articles: state.autocompleteState.articles
}), {
    setAutocompleteSelectedTag
})
@hot
@withStyles(styles)
class SearchModule extends React.Component {
    static propTypes = {
        // from router
        history: PropTypes.object,
        // from connect
        isUserConnected: PropTypes.bool,
        currentTopicId: PropTypes.number,
        recentTags: PropTypes.array,
        recentArticles: PropTypes.array,
        topics: PropTypes.array,
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        highlightedTag: PropTypes.object,
        highlightedArticle: PropTypes.object,
        setAutocompleteSelectedTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => SearchIndex.preload(), 5000);
    }

    _handleTagSelection = (tag) => {
        this.props.setAutocompleteSelectedTag(tag);
    };

    _performSearch = () => {
        this.props.history.push({
            pathname: searchPath(),
            search: Utils.toParams(Utils.compact({
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
        const tags = hasQuery ? this.props.tags : this.props.recentTags;
        const articles = hasQuery ? this.props.articles : this.props.recentArticles;

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
                          spacing={4}
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start">
                        <Grid className={this.props.classes.gridItem}
                              item={true}
                              xs={12}
                              sm={8}
                              md={9}
                              lg={9}>
                            <SearchArticleModule classes={this.props.classes}
                                                 isUserConnected={this.props.isUserConnected}
                                                 currentTopicId={this.props.currentTopicId}
                                                 hasQuery={hasQuery}
                                                 selectedTags={this.props.selectedTags}
                                                 highlightedArticleId={this.props.highlightedArticle?.id}
                                                 articles={articles}/>
                        </Grid>

                        <Grid className={this.props.classes.gridItem}
                              item={true}
                              xs={12}
                              sm={4}
                              md={3}
                              lg={3}>
                            <SearchTagModule classes={this.props.classes}
                                             isUserConnected={this.props.isUserConnected}
                                             currentTopicId={this.props.currentTopicId}
                                             hasQuery={hasQuery}
                                             tags={tags}
                                             selectedTags={this.props.selectedTags}
                                             highlightedTagId={this.props.highlightedTag && this.props.highlightedTag.id}
                                             onTagClick={this._handleTagSelection}/>

                            <SearchTopicModule classes={this.props.classes}
                                               topics={this.props.topics}/>
                        </Grid>
                    </Grid>

                    {
                        (!hasQuery && !this.props.isUserConnected) &&
                        <div className={this.props.classes.defaultMessage}>
                            {I18n.t('js.search.module.default')}
                        </div>
                    }

                    <div className={this.props.classes.searchButton}>
                        <Button color="primary"
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
