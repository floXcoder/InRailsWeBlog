'use strict';

import HighlightIcon from '@material-ui/icons/HighlightOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOffOutlined';

const ArticleOutdatedIcon = ({articleId, isOutdated, onOutdatedClick, size, color}) => (
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

ArticleOutdatedIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    isOutdated: PropTypes.bool.isRequired,
    onOutdatedClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleOutdatedIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleOutdatedIcon);
