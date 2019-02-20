'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagModule extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        tags: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        onTagClick: PropTypes.func.isRequired,
        selectedTags: PropTypes.array,
        highlightedTagId: PropTypes.number,
        currentTopicId: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.name);

        this.props.onTagClick(tag);
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
            return null;
        }
    };

    _renderTagItem = (primary, tag) => {
        return (
            <Chip key={tag.id}
                  className={classNames(this.props.classes.tag, {
                      [this.props.classes.tagSelected]: this.props.selectedTags.includes(tag),
                      [this.props.classes.tagHighlighted]: this.props.highlightedTagId === tag.id
                  })}
                  label={tag.name}
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={`/tagged/${tag.slug}`}
                  onClick={this._handleTagClick.bind(this, tag)}/>
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
                        !this.props.hasQuery &&
                        <span className={this.props.classes.categoryCount}>
                            {I18n.t('js.search.module.tags.recents')}
                        </span>
                    }
                </h2>

                <div>
                    {
                        currentTopicTags.map(this._renderTagItem.bind(this, true))
                    }

                    {
                        !Utils.isEmpty(otherTags) &&
                        <>
                            <Divider className={this.props.classes.categoryDivider}
                                     variant="fullWidth"/>

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
