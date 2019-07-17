'use strict';

import {
    Link
} from 'react-router-dom';

import List from '@material-ui/core/List';
import Zoom from '@material-ui/core/Zoom';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import TagRelationshipDisplay from '../display/relationship';

export default class TagSidebarList extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        tags: PropTypes.array.isRequired,
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
        isOpen: PropTypes.bool,
        hasChildInMainList: PropTypes.bool,
        onTagClick: PropTypes.func,
        filterText: PropTypes.string,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const isFiltering = !Utils.isEmpty(this.props.filterText);

        return (
            <List className={this.props.classes.tagList}>
                <Zoom in={this.props.isOpen}
                      timeout={350}>
                    <Link className={this.props.classes.labelsLink}
                          to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/tags`}>
                        <OpenInNewIcon className={this.props.classes.labelsIcon}/>
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
                {/*            <OpenInNewIcon className={this.props.classes.labelsIcon}/>*/}
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
                                                onTagClick={this.props.onTagClick}/>
                    </div>
                }

                {
                    this.props.isOpen && Utils.isEmpty(this.props.tags) &&
                    <p className={this.props.classes.noTags}>
                        {
                            this.props.filterText
                                ?
                                I18n.t('js.tag.common.no_results') + ' ' + this.props.filterText
                                :
                                I18n.t('js.tag.common.no_tags')
                        }
                    </p>
                }
            </List>
        );
    }
}
