'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

import TooltipTag from '../../tags/display/tooltip';

export default class ArticleTags extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tags: PropTypes.object.isRequired,
        parentTagIds: PropTypes.array,
        childTagIds: PropTypes.array
    };

    static defaultProps = {
        parentTagIds: [],
        childTagIds: []
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

        if (childTags.size === 0) {
            parentTags = this.props.tags;
        }

        return (
            <div className="article-tags">
                <div className="article-parent-tags">
                    <span className="article-tag-title">
                        {
                            childTags.size > 0
                                ?
                                I18n.t('js.article.model.parent_tags')
                                :
                                I18n.t('js.article.model.tags')
                        }
                    </span>

                    {
                        parentTags.map((tag) => (
                            <span key={tag.id}
                                  className="article-tag">
                                <Link id={`article-${this.props.articleId}-tags-${tag.id}`}
                                      className="tag-default tag-parent"
                                      to={`/article/tags/${tag.slug}`}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id)}
                                      onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                      onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}>
                                    {tag.name}
                                </Link>

                                <TooltipTag tag={tag}
                                            articleId={this.props.articleId}
                                            tagTooltipActive={this.state.tagTooltipActive}/>
                            </span>
                        ))
                    }
                </div>

                {
                    childTags.size > 0 &&
                    <div className="article-child-tags">
                        <span className="article-tag-title">
                            {I18n.t('js.article.model.child_tags')}
                        </span>

                        {
                            childTags.map((tag) => (
                                <span key={tag.id}
                                      className="article-tag">
                                    <Link id={`article-${this.props.articleId}-tags-${tag.id}`}
                                          className="tag-default tag-child"
                                          to={`/article/tags/${tag.slug}`}
                                          onClick={spyTrackClick.bind(null, 'tag', tag.id)}
                                          onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                          onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}>
                                        {tag.name}
                                    </Link>

                                    <TooltipTag tag={tag}
                                                articleId={this.props.articleId}
                                                tagTooltipActive={this.state.tagTooltipActive}/>
                                </span>
                            ))
                        }
                    </div>
                }
            </div>
        );
    }
}
