import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';

import I18n from '@js/modules/translations';

import * as Utils from '@js/modules/utils';

import {
    spyTrackClick
} from '@js/actions/metricsActions';

import {
    showTagPath
} from '@js/constants/routesHelper';


const TooltipTag = function TooltipTag({
                                           tag,
                                           children
                                       }) {
    return (
        <Tooltip placement="bottom"
                 arrow={true}
                 classes={{
                     tooltip: 'tooltip-tag-tooltip',
                     arrow: 'tooltip-tag-arrow'
                 }}
                 title={
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
                 }>
            {children}
        </Tooltip>
    );
};

TooltipTag.propTypes = {
    tag: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

export default React.memo(TooltipTag);
