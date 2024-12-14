import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import ShareIcon from '@mui/icons-material/Share';

import I18n from '@js/modules/translations';

import {
    shareArticleParam
} from '@js/constants/routesHelper';


function ArticleShareIcon({
                              articleId,
                              size = 'medium',
                              color = 'primary'
                          }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.share')}>
            <Link to={{
                hash: '#' + shareArticleParam,
            }}
                  state={articleId}>
                <ShareIcon color={color}
                           fontSize={size}/>
            </Link>
        </span>
    );
}


ArticleShareIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleShareIcon);
