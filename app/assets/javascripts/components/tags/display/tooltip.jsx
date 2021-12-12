'use strict';

import ToolTip from 'react-portal-tooltip';

import {
    spyTrackClick
} from '../../../actions';

import {
    showTagPath
} from '../../../constants/routesHelper';

const style = {
    style: {
        color: '#199332',
        border: '1px solid #199332',
        padding: 16,
        background: '#fff',
        boxShadow: 'none',
        borderRadius: 4,
    },
    arrowStyle: {
        color: '#fff',
        borderColor: '#199332'
    }
};


export default class TooltipTag extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tag: PropTypes.object.isRequired,
        tagTooltipActive: PropTypes.number
    };

    render() {
        const {articleId, tag, tagTooltipActive} = this.props;

        return (
            <ToolTip active={tagTooltipActive === tag.id}
                     position="bottom"
                     arrow="center"
                     parent={`#article-${articleId}-tags-${tag.id}`}
                     style={style}>
                <div>
                    <div className="tooltip-tag-heading">
                        {I18n.t('js.tag.common.usage', {count: tag.taggedArticlesCount})}
                    </div>

                    <div className="tooltip-tag-description">
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: tag.description}}/>

                        <p>
                            {
                                Utils.isPresent(tag.synonyms) &&
                                I18n.t('js.tag.model.synonyms') + ' : ' + tag.synonyms.join(', ')
                            }
                        </p>

                        <div className="margin-top-10">
                            <a href={showTagPath(tag.slug)}
                               onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}>
                                {I18n.t('js.tag.common.link')}
                            </a>
                        </div>
                    </div>
                </div>
            </ToolTip>
        );
    }
}
