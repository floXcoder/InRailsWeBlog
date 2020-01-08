'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    spyTrackClick
} from '../../../actions';

import TooltipTag from '../../tags/display/tooltip';

import styles from '../../../../jss/tag/chip';

export default @withStyles(styles)
class ArticleTags extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tags: PropTypes.array.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        parentTagIds: PropTypes.array,
        childTagIds: PropTypes.array,
        hasTooltip: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        parentTagIds: [],
        childTagIds: [],
        hasTooltip: true
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
                              className={this.props.classes.parent}>
                                <Chip component={Link}
                                      id={`article-${this.props.articleId}-tags-${tag.id}`}
                                      classes={{
                                          root: this.props.classes.tagChip,
                                          label: this.props.classes.tagLabel
                                      }}
                                      to={`/tagged/${tag.slug}`}
                                      label={tag.name}
                                      variant="outlined"
                                      icon={<LabelIcon/>}
                                      clickable={true}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}
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
                              className={this.props.classes.child}>
                            <Chip component={Link}
                                  id={`article-${this.props.articleId}-tags-${tag.id}`}
                                  classes={{
                                      root: this.props.classes.tagChip,
                                      label: this.props.classes.tagLabel
                                  }}
                                  to={this.props.currentUserSlug && this.props.currentUserTopicSlug && parentTags ? `/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/tagged/${parentTags.first().slug}/${tag.slug}` : `/tagged/${tag.slug}`}
                                  label={tag.name}
                                  variant="outlined"
                                  color="default"
                                  icon={<LabelIcon/>}
                                  clickable={true}
                                  onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}
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
