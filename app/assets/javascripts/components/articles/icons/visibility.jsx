'use strict';

import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOffOutlined';

const ArticleVisibilityIcon = ({articleId, articleVisibility, onVisibilityClick, size, color}) => {
    const isVisible = articleVisibility === 'everyone';

    const visibilityName = I18n.t(`js.article.enums.visibility.${articleVisibility}`);
    const visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    return (
        <span className="tooltip-bottom"
              data-tooltip={visibilityTooltip}>
            <a href="#"
               onClick={onVisibilityClick}>
                {
                    isVisible
                        ?
                        <VisibilityIcon color={color}
                                        fontSize={size}/>
                        :
                        <VisibilityOffIcon color={color}
                                           fontSize={size}/>
                }
            </a>
        </span>
    );
};

ArticleVisibilityIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    onVisibilityClick: PropTypes.func,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleVisibilityIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleVisibilityIcon);
