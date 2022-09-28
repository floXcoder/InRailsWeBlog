'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import LabelIcon from '@mui/icons-material/Label';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import {
    taggedArticlesPath,
    taggedTopicArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import Loader from '../../theme/loader';


export default class SearchTagModule extends React.Component {
    static propTypes = {
        isSearching: PropTypes.bool.isRequired,
        isUserConnected: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        hasTagIcon: PropTypes.bool,
        hasSearchIcon: PropTypes.bool,
        selectedTags: PropTypes.array,
        highlightedTagId: PropTypes.number,
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        onTagClick: PropTypes.func
    };

    static defaultProps = {
        hasTagIcon: false,
        hasSearchIcon: true
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag, event) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.userId, tag.name, null);

        return event;
    };

    _currentTopicTags = () => {
        if (this.props.currentTopicId) {
            return this.props.tags.filter((tag) => (
                tag.userId === this.props.currentUserId && tag.topicIds.includes(this.props.currentTopicId)
            ));
        } else {
            return this.props.tags;
        }
    };

    _otherTopicTags = () => {
        if (this.props.currentTopicId) {
            return this.props.tags.filter((tag) => (
                tag.userId === this.props.currentUserId && !tag.topicIds.includes(this.props.currentTopicId)
            ));
        } else {
            return [];
        }
    };

    _otherUserTags = () => {
        if (this.props.currentUserId) {
            return this.props.tags.filter((tag) => (
                tag.userId !== this.props.currentUserId
            ));
        } else {
            return [];
        }
    };

    _renderTagItem = (primary, tag) => {
        return (
            <Chip key={tag.id}
                  className={classNames('search-module-tag', {
                      'search-module-tag-selected': this.props.selectedTags.includes(tag),
                      'search-module-tag-highlighted': this.props.highlightedTagId === tag.id
                  })}
                  color="primary"
                  variant="outlined"
                  clickable={true}
                  icon={this.props.hasTagIcon ? <LabelIcon/> : null}
                  label={
                      <Link className="search-module-tag-link"
                            to={this.props.currentUserSlug && this.props.currentUserTopicSlug ? taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, tag.slug) : taggedArticlesPath(tag.slug)}
                            onClick={this._handleTagClick.bind(this, tag)}>
                          {tag.name}
                      </Link>
                  }
                  onDelete={this.props.hasSearchIcon && this.props.onTagClick ? this.props.onTagClick.bind(this, tag) : undefined}
                  deleteIcon={this.props.hasSearchIcon ? <ZoomInIcon className="search-module-tag-add"/> : null}/>
        );
    };

    render() {
        const currentTopicTags = this._currentTopicTags();
        const otherTopicTags = this._otherTopicTags();
        const otherUserTags = this._otherUserTags();

        return (
            <div className="search-module-category">
                <h2 className="search-module-category-name">
                    {I18n.t('js.search.module.tags.title')}

                    {
                        !!(this.props.isUserConnected && !this.props.hasQuery) &&
                        <span className="search-module-category-count">
                            {I18n.t('js.search.module.tags.recents')}
                        </span>
                    }
                </h2>

                {
                    this.props.isSearching
                        ?
                        <div className="search-module-searching">
                            <Loader size="big"/>
                        </div>
                        :
                        <div>
                            {
                                !!(this.props.hasQuery && this.props.tags.length === 0) &&
                                <p className="search-module-tag-none">
                                    <em>{I18n.t('js.search.module.tags.none')}</em>
                                </p>
                            }

                            {
                                currentTopicTags.map(this._renderTagItem.bind(this, true))
                            }

                            {
                                Utils.isPresent(otherTopicTags) &&
                                <>
                                    {
                                        Utils.isPresent(currentTopicTags) &&
                                        <Divider className="search-module-category-divider"
                                                 variant="fullWidth"/>
                                    }

                                    {
                                        otherTopicTags.map(this._renderTagItem.bind(this, false))
                                    }
                                </>
                            }

                            {
                                Utils.isPresent(otherUserTags) &&
                                <>
                                    {
                                        (Utils.isPresent(currentTopicTags) || Utils.isPresent(otherTopicTags)) &&
                                        <Divider className="search-module-category-divider"
                                                 variant="fullWidth"/>
                                    }

                                    {
                                        otherUserTags.map(this._renderTagItem.bind(this, false))
                                    }
                                </>
                            }
                        </div>
                }
            </div>
        );
    }
}
