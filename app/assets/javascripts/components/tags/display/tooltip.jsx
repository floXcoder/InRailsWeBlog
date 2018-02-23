'use strict';

import ToolTip from 'react-portal-tooltip';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const tooltipStyle = {
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

const TooltipTag = ({articleId, tag, tagTooltipActive}) => (
    <ToolTip active={tagTooltipActive === tag.id}
             position="bottom"
             arrow="center"
             parent={`#article-${articleId}-tags-${tag.id}`}
             style={tooltipStyle}>
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
                        !Utils.isEmpty(tag.synonyms) &&
                        I18n.t('js.tag.model.synonyms') + ' : ' + tag.synonyms.join(', ')
                    }
                </p>

                <div className="margin-top-10">
                    <Link to={`/tag/${tag.slug}`}
                          onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                        {I18n.t('js.tag.common.link')}
                    </Link>
                </div>
            </div>
        </div>
    </ToolTip>
);

TooltipTag.propTypes = {
    articleId: PropTypes.number.isRequired,
    tag: PropTypes.object.isRequired,
    tagTooltipActive: PropTypes.number
};

export default TooltipTag;
