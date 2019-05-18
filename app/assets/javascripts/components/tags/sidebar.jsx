'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
// import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';

// import LabelIcon from '@material-ui/icons/Label';
// import SearchIcon from '@material-ui/icons/Search';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {
    // filterTags,
    spyTrackClick
} from '../../actions';

import {
    getTags,
    getSortedTopicTags
} from '../../selectors';

// import AssociatedTagBox from '../tags/associated/box';

import TagRelationshipDisplay from './display/relationship';

// import SearchBar from '../theme/searchBar';
import Loader from '../theme/loader';

import styles from '../../../jss/tag/sidebar';

export default @connect((state, props) => ({
    isLoading: state.tagState.isFetching,
    filterText: state.tagState.filterText,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    tags: props.isCloud ? getTags(state) : getSortedTopicTags(state)
}), {
    // filterTags
})
@withStyles(styles)
class TagSidebar extends React.Component {
    static propTypes = {
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
        isCloud: PropTypes.bool,
        isOpen: PropTypes.bool,
        hasChildInMainList: PropTypes.bool,
        onTagClick: PropTypes.func,
        // from connect
        isLoading: PropTypes.bool,
        filterText: PropTypes.string,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        tags: PropTypes.array,
        // filterTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isCloud: false
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tagId, tagName, tagSlug) => {
        if (this.props.onTagClick) {
            this.props.onTagClick();
        }

        spyTrackClick('tag', tagId, tagSlug, tagName);
    };

    // _handleSearchInput = (value) => {
    //     this.props.filterTags(value);
    // };

    render() {
        if (this.props.isLoading) {
            return (
                <List>
                    <div className="center">
                        <Loader/>
                    </div>
                </List>
            )
        } else if (this.props.isCloud) {
            return (
                <div className={this.props.classes.list}>
                    {
                        this.props.tags.map((tag) => (
                            <Chip key={tag.id}
                                  className={classNames(this.props.classes.tagList, {
                                      [this.props.classes.selectedLabel]: this.props.currentTagSlug === tag.slug
                                  })}
                                  label={tag.name}
                                  color="primary"
                                  variant="outlined"
                                  component={Link}
                                  to={`/tagged/${tag.slug}`}
                                  onClick={this._handleTagClick.bind(this, tag.id, tag.name, tag.slug)}/>
                        ))
                    }
                </div>
            );
        } else {
            const isFiltering = !Utils.isEmpty(this.props.filterText);

            return (
                <List className={this.props.classes.root}>
                    <Zoom in={this.props.isOpen}
                          timeout={350}>
                        <Link className={this.props.classes.allLabels}
                              to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/tags`}>
                            <OpenInNewIcon className={this.props.classes.iconLabels}/>
                        </Link>
                    </Zoom>

                    {/*<ListItem classes={{*/}
                    {/*    root: this.props.classes.listItem*/}
                    {/*}}>*/}
                    {/*    <Zoom in={!this.props.isOpen}*/}
                    {/*          timeout={350}>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <LabelIcon/>*/}
                    {/*        </ListItemIcon>*/}
                    {/*    </Zoom>*/}

                    {/*    <ListItemText classes={{*/}
                    {/*        root: classNames(this.props.classes.item, this.props.classes.title, {*/}
                    {/*            [this.props.classes.itemOpen]: this.props.isOpen*/}
                    {/*        })*/}
                    {/*    }}>*/}
                    {/*        {I18n.t('js.tag.common.list')}*/}

                    {/*        <Link to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/tags`}>*/}
                    {/*            <OpenInNewIcon className={this.props.classes.iconLabels}/>*/}
                    {/*        </Link>*/}
                    {/*    </ListItemText>*/}
                    {/*</ListItem>*/}

                    {/*<ListItem classes={{*/}
                    {/*    root: this.props.classes.searchItem*/}
                    {/*}}>*/}
                    {/*    <Grow in={!this.props.isOpen}*/}
                    {/*          timeout={350}*/}
                    {/*          style={{transformOrigin: '0 0 0'}}>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <SearchIcon/>*/}
                    {/*        </ListItemIcon>*/}
                    {/*    </Grow>*/}

                    {/*    <div className={*/}
                    {/*        classNames(this.props.classes.item, {*/}
                    {/*            [this.props.classes.itemOpen]: this.props.isOpen*/}
                    {/*        })*/}
                    {/*    }>*/}
                    {/*        <SearchBar classes={this.props.classes.input}*/}
                    {/*                   label={I18n.t('js.tag.common.filter')}*/}
                    {/*                   onSearchInput={this._handleSearchInput}>*/}
                    {/*            {this.props.filterText}*/}
                    {/*        </SearchBar>*/}
                    {/*    </div>*/}
                    {/*</ListItem>*/}

                    {
                        !Utils.isEmpty(this.props.tags) &&
                        <div className={classNames(this.props.classes.tags,
                            {[this.props.classes.tagsOpen]: this.props.isOpen})
                        }>
                            <TagRelationshipDisplay tags={this.props.tags}
                                                    hasChildInMainList={this.props.hasChildInMainList}
                                                    currentTagSlug={this.props.currentTagSlug}
                                                    currentChildTagSlug={this.props.currentChildTagSlug}
                                                    isFiltering={isFiltering}
                                                    onTagClick={this._handleTagClick}/>
                        </div>
                    }

                    {
                        this.props.isOpen && Utils.isEmpty(this.props.tags) &&
                        <div>
                            {
                                this.props.filterText
                                    ?
                                    I18n.t('js.tag.common.no_results') + ' ' + this.props.filterText
                                    :
                                    I18n.t('js.tag.common.no_tags')
                            }
                        </div>
                    }
                </List>
            );
        }
    }
}
