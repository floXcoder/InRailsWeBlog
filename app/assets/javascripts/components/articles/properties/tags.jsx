'use strict';

import {
    Link
} from 'react-router-dom';

import ToolTip from 'react-portal-tooltip';

@connect(null, {
    // onTagClick
})
export default class ArticleTags extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        // From connect
        onTagClick: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        tagTooltipActive: undefined
    };

    _handleTagClick = (tagId, tagName, event) => {
        // TODO: onTrackClick is not a function
        // TagStore.onTrackClick(tagId);

        if (this.props.onTagClick) {
            event.preventDefault();
            this.props.onTagClick(tagId, tagName);
        }
    };

    _showTagTooltip = (tagId) => {
        this.setState({tagTooltipActive: tagId});
    };

    _hideTagTooltip = () => {
        this.setState({tagTooltipActive: null});
    };

    render() {
        // TODO: do not use style
        let style = {
            style: {
                background: '#535a60',
                color: '#e4e6e8',
                padding: 10,
                boxShadow: '0 1px 3px rgba(12,13,14,0.3)',
                borderRadius: '2px',
                border: '1px solid #242729'
            },
            arrowStyle: {
                color: 'rgba(0,0,0,.8)',
                borderColor: false
            }
        };

        return (
            <div className={classNames('article-tags', {'article-tags-empty': this.props.tags.length === 0})}>
                {
                    this.props.tags.map((tag, i) => (
                            <div key={i}
                                 className="article-tag">
                                <Link id={`article-${this.props.articleId}-tags-${tag.id}`}
                                      className={classNames(
                                          'btn-small waves-effect waves-light tag-default',
                                          {
                                              'tag-parent': this.props.parentTags.includes(tag.id),
                                              'tag-child': this.props.childTags.includes(tag.id)
                                          }
                                      )}
                                      to={`/article/tags/${tag.slug}`}
                                      onClick={this._handleTagClick.bind(this, tag.id, tag.name)}
                                      onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                      onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}>
                                    {tag.name}
                                </Link>

                                <ToolTip active={this.state.tagTooltipActive === tag.id}
                                         position="bottom"
                                         arrow="center"
                                         parent={`#article-${this.props.articleId}-tags-${tag.id}`}
                                         style={style}>
                                    <div className="tag-tooltip">
                                        <div className="tag-tooltip-heading">
                                            {I18n.t('js.tag.common.usage', {count: tag.taggedArticlesCount})}
                                        </div>

                                        <div className="tag-tooltip-description">
                                            <p>
                                                {tag.description}
                                            </p>

                                            <p>
                                                {
                                                    !$.isEmpty(tag.synonyms) &&
                                                    I18n.t('js.tag.model.synonyms') + ' : ' + tag.synonyms.join(', ')
                                                }
                                            </p>

                                            <div className="margin-top-10">
                                                <Link to={`/tag/${tag.slug}`}>
                                                    {I18n.t('js.tag.common.link')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </ToolTip>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}
