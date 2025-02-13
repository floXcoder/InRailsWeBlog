import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import Chip from '@mui/material/Chip';

import LabelIcon from '@mui/icons-material/Label';

import {
    taggedArticlesPath,
    taggedTopicArticlesPath
} from '@js/constants/routesHelper';

import {
    spyTrackClick
} from '@js/actions/metricsActions';

import TooltipTag from '@js/components/tags/display/tooltip';


export default class ArticleTags extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tags: PropTypes.array.isRequired,
        isOwner: PropTypes.bool,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        parentTagIds: PropTypes.array,
        childTagIds: PropTypes.array,
        hasTooltip: PropTypes.bool,
        isLarge: PropTypes.bool,
        isSmall: PropTypes.bool
    };

    static defaultProps = {
        parentTagIds: [],
        childTagIds: [],
        hasTooltip: true,
        isLarge: false,
        isSmall: false
    };

    constructor(props) {
        super(props);
    }

    _renderTag = (tag, parentTags) => {
        const link = parentTags ? (this.props.isOwner && this.props.currentUserSlug && this.props.currentUserTopicSlug && parentTags.length ? taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, parentTags.first().slug, tag.slug) : taggedArticlesPath(tag.slug)) : (this.props.isOwner && this.props.currentUserSlug && this.props.currentUserTopicSlug ? taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, tag.slug) : taggedArticlesPath(tag.slug));

        return (
            <Chip component={Link}
                  id={`article-${this.props.articleId}-tags-${tag.id}`}
                  classes={{
                      root: classNames('tag-chip-tag-chip', {
                          'tag-chip-tag-chip-large': this.props.isLarge,
                          'tag-chip-tag-chip-small': this.props.isSmall
                      }),
                      label: classNames('tag-chip-tag-chip', {
                          'tag-chip-tag-label-small': this.props.isSmall
                      })
                  }}
                  to={link}
                  label={tag.name}
                  variant="outlined"
                  color="default"
                  icon={<LabelIcon fontSize={this.props.isSmall ? 'small' : undefined}/>}
                  clickable={true}
                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}/>
        );
    };

    render() {
        if (this.props.tags.length === 0) {
            return null;
        }

        let parentTags = this.props.tags.filter((tag) => this.props.parentTagIds.includes(tag.id));
        const childTags = this.props.tags.filter((tag) => this.props.childTagIds.includes(tag.id));

        if (childTags.length === 0) {
            parentTags = this.props.tags;
        }

        return (
            <div>
                {
                    parentTags.map((tag) => (
                        <span key={tag.id}
                              className="tag-chip-parent">
                            {
                                this.props.hasTooltip
                                    ?
                                    <TooltipTag tag={tag}>
                                        {this._renderTag(tag)}
                                    </TooltipTag>
                                    :
                                    this._renderTag(tag)
                            }
                        </span>
                    ))
                }

                {
                    childTags.map((tag) => (
                        <span key={tag.id}
                              className="tag-chip-child">
                            {
                                this.props.hasTooltip
                                    ?
                                    <TooltipTag tag={tag}>
                                        {this._renderTag(tag, parentTags)}
                                    </TooltipTag>
                                    :
                                    this._renderTag(tag)
                            }
                        </span>
                    ))
                }
            </div>
        );
    }
}
