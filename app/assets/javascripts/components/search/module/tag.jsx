'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import LabelIcon from '@material-ui/icons/Label';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import {
    taggedArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagModule extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        isUserConnected: PropTypes.bool.isRequired,
        tags: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        onTagClick: PropTypes.func.isRequired,
        hasTagIcon: PropTypes.bool,
        hasSearchIcon: PropTypes.bool,
        selectedTags: PropTypes.array,
        highlightedTagId: PropTypes.number,
        currentTopicId: PropTypes.number
    };

    static defaultProps = {
        hasTagIcon: false,
        hasSearchIcon: true
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.name);
    };

    _currentTopicTags = () => {
        if (this.props.currentTopicId) {
            return this.props.tags.filter((tag) => (
                tag.topicIds.includes(this.props.currentTopicId)
            ));
        } else {
            return this.props.tags;
        }
    };

    _otherTags = () => {
        if (this.props.currentTopicId) {
            return this.props.tags.filter((tag) => (
                !tag.topicIds.includes(this.props.currentTopicId)
            ));
        } else {
            return [];
        }
    };

    _renderTagItem = (primary, tag) => {
        return (
            <Chip key={tag.id}
                  className={classNames(this.props.classes.tag, {
                      [this.props.classes.tagSelected]: this.props.selectedTags.includes(tag),
                      [this.props.classes.tagHighlighted]: this.props.highlightedTagId === tag.id
                  })}
                  color="primary"
                  variant="outlined"
                  clickable={true}
                  icon={this.props.hasTagIcon ? <LabelIcon/> : undefined}
                  label={
                      <Link className={this.props.classes.tagLink}
                            to={taggedArticlesPath(tag.slug)}
                            onClick={this._handleTagClick.bind(this, tag)}>
                          {tag.name}
                      </Link>
                  }
                  onDelete={this.props.hasSearchIcon ? this.props.onTagClick.bind(this, tag) : undefined}
                  deleteIcon={this.props.hasSearchIcon ? <ZoomInIcon className={this.props.classes.tagAdd}/> : undefined}/>
        );
    };

    render() {
        const currentTopicTags = this._currentTopicTags();
        const otherTags = this._otherTags();

        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.module.tags.title')}

                    {
                        (this.props.isUserConnected && !this.props.hasQuery) &&
                        <span className={this.props.classes.categoryCount}>
                            {I18n.t('js.search.module.tags.recents')}
                        </span>
                    }
                </h2>

                <div>
                    {
                        (this.props.hasQuery && currentTopicTags.length === 0 && otherTags.length === 0) &&
                        <p className={this.props.classes.tagNone}>
                            {I18n.t('js.search.module.tags.none')}
                        </p>
                    }

                    {
                        currentTopicTags.map(this._renderTagItem.bind(this, true))
                    }

                    {
                        !Utils.isEmpty(otherTags) &&
                        <>
                            {
                                !Utils.isEmpty(currentTopicTags) &&
                                <Divider className={this.props.classes.categoryDivider}
                                         variant="fullWidth"/>
                            }

                            {
                                otherTags.map(this._renderTagItem.bind(this, false))
                            }
                        </>
                    }
                </div>
            </div>
        );
    }
}
