'use strict';

import _ from 'lodash';

import TagStore from '../../../stores/tagStore';

import ToolTip from 'react-portal-tooltip';

import {Link} from 'react-router-dom';

export default class ArticleTags extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onTagClick: PropTypes.func,
        linkTag: PropTypes.string
    };

    static defaultProps = {
        onTagClick: null,
        linkTag: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        tagTooltipActive: null
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

    _hideTagTooltip = (tagId) => {
        this.setState({tagTooltipActive: null});
    };

    render() {
        const parentTags = _.keyBy(this.props.article.parent_tags, 'id');
        const childTags = _.keyBy(this.props.article.child_tags, 'id');
        const tags = this.props.article.tags;

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
            <div className={classNames('article-tags', {'article-tags-empty': tags.length === 0})}>
                {
                    tags.map((tag, i) =>
                        <div key={i}
                             className="article-tag">
                            <Link id={`article-${this.props.article.id}-tags-${tag.id}`}
                                  className={classNames(
                                      'waves-effect', 'waves-light', 'btn-small', 'tag-default',
                                      {
                                          'tag-parent': parentTags[tag.id],
                                          'tag-child': childTags[tag.id]
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
                                     parent={`#article-${this.props.article.id}-tags-${tag.id}`}
                                     style={style}>
                                <div className="tag-tooltip">
                                    <div className="tag-tooltip-heading">
                                        {I18n.t('js.tag.common.usage', {count: tag.tagged_articles_count})}
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
                }
            </div>
        );
    }
}
