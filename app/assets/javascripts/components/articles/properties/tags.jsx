'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    taggedArticlesPath,
    taggedTopicArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import TooltipTag from '../../tags/display/tooltip';


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

    state = {
        tagTooltipActive: undefined
    };

    _showTagTooltip = (tagId) => {
        this.setState({
            tagTooltipActive: tagId
        });
    };

    _hideTagTooltip = () => {
        this.setState({
            tagTooltipActive: null
        });
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
                                <Chip component={Link}
                                      id={`article-${this.props.articleId}-tags-${tag.id}`}
                                      classes={{
                                          root: classNames('tag-chip-tagChip', {
                                              'tag-chip-tagChipLarge': this.props.isLarge,
                                              'tag-chip-tagChipSmall': this.props.isSmall
                                          }),
                                          label: classNames('tag-chip-tagLabel', {
                                              'tag-chip-tagLabelSmall': this.props.isSmall
                                          })
                                      }}
                                      to={this.props.isOwner && this.props.currentUserSlug && this.props.currentUserTopicSlug ? taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, tag.slug) : taggedArticlesPath(tag.slug)}
                                      label={tag.name}
                                      variant="outlined"
                                      icon={<LabelIcon/>}
                                      clickable={true}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}
                                      onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                      onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}/>

                            {
                                this.props.hasTooltip &&
                                <TooltipTag tag={tag}
                                            articleId={this.props.articleId}
                                            tagTooltipActive={this.state.tagTooltipActive}/>
                            }
                        </span>
                    ))
                }

                {
                    childTags.map((tag) => (
                        <span key={tag.id}
                              className="tag-chip-child">
                            <Chip component={Link}
                                  id={`article-${this.props.articleId}-tags-${tag.id}`}
                                  classes={{
                                      root: 'tag-chip-tagChip',
                                      label: 'tag-chip-tagLabel'
                                  }}
                                  to={this.props.isOwner && this.props.currentUserSlug && this.props.currentUserTopicSlug && parentTags.length ? taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, parentTags.first().slug, tag.slug) : taggedArticlesPath(tag.slug)}
                                  label={tag.name}
                                  variant="outlined"
                                  color="default"
                                  icon={<LabelIcon/>}
                                  clickable={true}
                                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}
                                  onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                  onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}/>

                            {
                                this.props.hasTooltip &&
                                <TooltipTag tag={tag}
                                            articleId={this.props.articleId}
                                            tagTooltipActive={this.state.tagTooltipActive}/>
                            }
                        </span>
                    ))
                }
            </div>
        );
    }
}
