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
        return (
            <div className={classNames(
                'article-tags', {
                    'article-tags-empty': this.props.tags.length === 0
                })}>
                {
                    this.props.tags.map((tag) => (
                        <div key={tag.id}
                             className="article-tag">
                            <Link id={`article-${this.props.articleId}-tags-${tag.id}`}
                                  className={classNames(
                                      'btn-small waves-effect waves-light tag-default',
                                      {
                                          'tag-parent': this.props.parentTagIds.includes(tag.id),
                                          'tag-child': this.props.childTagIds.includes(tag.id)
                                      }
                                  )}
                                  to={`/article/tags/${tag.slug}`}
                                  onClick={spyTrackClick.bind(null, 'tag', tag.id)}
                                  onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                  onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}>
                                {tag.name}
                            </Link>

                            <TooltipTag articleId={this.props.articleId}
                                        tag={tag}
                                        tagTooltipActive={this.state.tagTooltipActive}/>
                        </div>
                    ))
                }
            </div>
        );
    }
}
