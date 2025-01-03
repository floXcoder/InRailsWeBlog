import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import List from '@mui/material/List';
import Zoom from '@mui/material/Zoom';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    topicTagsPath
} from '@js/constants/routesHelper';

import Scrollbar from '@js/components/theme/scrollbar';

import TagRelationshipDisplay from '@js/components/tags/display/relationship';


const TagSidebarList = function (props) {
    const isFiltering = Utils.isPresent(props.filterText);

    return (
        <List className="tag-sidebar-tag-list">
            <Zoom in={props.isOpen}
                  timeout={350}>
                <Link className="tag-sidebar-labels-link"
                      to={topicTagsPath(props.currentUserSlug, props.currentUserTopicSlug)}>
                    <OpenInNewIcon className="tag-sidebar-labels-icon"/>
                </Link>
            </Zoom>

            {/*<ListItem classes={{*/}
            {/*    root: tag-sidebar-listItem*/}
            {/*}}>*/}
            {/*    <Zoom in={!this.props.isOpen}*/}
            {/*          timeout={350}>*/}
            {/*        <ListItemIcon>*/}
            {/*            <LabelIcon/>*/}
            {/*        </ListItemIcon>*/}
            {/*    </Zoom>*/}

            {/*    <ListItemText classes={{*/}
            {/*        root: classNames(tag-sidebar-item, tag-sidebar-title, {*/}
            {/*            [tag-sidebar-item-open]: this.props.isOpen*/}
            {/*        })*/}
            {/*    }}>*/}
            {/*        {I18n.t('js.tag.common.list')}*/}

            {/*        <Link to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/tags`}>*/}
            {/*            <OpenInNewIcon className={tag-sidebar-labelsIcon}/>*/}
            {/*        </Link>*/}
            {/*    </ListItemText>*/}
            {/*</ListItem>*/}

            {/*<ListItem classes={{*/}
            {/*    root: tag-sidebar-search-item*/}
            {/*}}>*/}
            {/*    <Grow in={!this.props.isOpen}*/}
            {/*          timeout={350}*/}
            {/*          style={{transformOrigin: '0 0 0'}}>*/}
            {/*        <ListItemIcon>*/}
            {/*            <SearchIcon/>*/}
            {/*        </ListItemIcon>*/}
            {/*    </Grow>*/}

            {/*    <div className={*/}
            {/*        classNames(tag-sidebar-item, {*/}
            {/*            [tag-sidebar-item-open]: this.props.isOpen*/}
            {/*        })*/}
            {/*    }>*/}
            {/*        <SearchBar classes={tag-sidebar-input}*/}
            {/*                   label={I18n.t('js.tag.common.filter')}*/}
            {/*                   onSearchInput={this._handleSearchInput}>*/}
            {/*            {this.props.filterText}*/}
            {/*        </SearchBar>*/}
            {/*    </div>*/}
            {/*</ListItem>*/}

            {
                Utils.isPresent(props.tags) &&
                <div className={classNames(
                    'tag-sidebar-tags',
                    {'tag-sidebar-tags-open': props.isOpen}
                )}>
                    <Scrollbar>
                        <TagRelationshipDisplay tags={props.tags}
                                                hasChildInMainList={props.hasChildInMainList}
                                                currentTagSlug={props.currentTagSlug}
                                                currentChildTagSlug={props.currentChildTagSlug}
                                                isFiltering={isFiltering}
                                                onTagClick={props.onTagClick}/>
                    </Scrollbar>
                </div>
            }

            {
                !!(props.isOpen && Utils.isEmpty(props.tags)) &&
                <p className="tag-sidebar-no-tags">
                    {
                        props.filterText
                            ?
                            I18n.t('js.tag.common.no_results') + ' ' + props.filterText
                            :
                            (props.isCloud ? I18n.t('js.tag.common.no_cloud_tags') : I18n.t('js.tag.common.no_tags'))
                    }
                </p>
            }
        </List>
    );
};

TagSidebarList.propTypes = {
    tags: PropTypes.array.isRequired,
    currentTagSlug: PropTypes.string,
    currentChildTagSlug: PropTypes.string,
    isOpen: PropTypes.bool,
    isCloud: PropTypes.bool,
    hasChildInMainList: PropTypes.bool,
    onTagClick: PropTypes.func,
    filterText: PropTypes.string,
    currentUserSlug: PropTypes.string,
    currentUserTopicSlug: PropTypes.string
};

export default TagSidebarList;
