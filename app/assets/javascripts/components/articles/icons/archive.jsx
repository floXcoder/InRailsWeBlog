import React from 'react';
import PropTypes from 'prop-types';

import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import I18n from '@js/modules/translations';


function ArticleArchiveIcon({
                                isArchived,
                                size = 'medium',
                                color = 'primary',
                                onArchiveClick
                            }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t(`js.article.tooltip.${isArchived ? 'unarchived' : 'archived'}`)}>
            <a href="#"
               onClick={onArchiveClick}>
                {
                    isArchived
                        ?
                        <UnarchiveIcon color={color}
                                       fontSize={size}/>
                        :
                        <ArchiveIcon color={color}
                                     fontSize={size}/>
                }
            </a>
        </span>
    );
}


ArticleArchiveIcon.propTypes = {
    isArchived: PropTypes.bool.isRequired,
    onArchiveClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleArchiveIcon);
