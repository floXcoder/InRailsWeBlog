'use strict';

import HighlightIcon from '@mui/icons-material/HighlightOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOffOutlined';

function ArticleOutdatedIcon({
                                 isOutdated,
                                 onOutdatedClick,
                                 size = 'medium',
                                 color = 'primary'
                             }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={isOutdated ? I18n.t('js.article.tooltip.remove_outdated') : I18n.t('js.article.tooltip.add_outdated')}>
            <a href="#"
               onClick={onOutdatedClick}>
                {
                    isOutdated
                        ?
                        <HighlightIcon color={color}
                                       fontSize={size}/>
                        :
                        <HighlightOffIcon color={color}
                                          fontSize={size}/>
                }
            </a>
        </span>
    );
}

ArticleOutdatedIcon.propTypes = {
    isOutdated: PropTypes.bool.isRequired,
    onOutdatedClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleOutdatedIcon);
