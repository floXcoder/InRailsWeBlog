'use strict';

import DeleteIcon from '@mui/icons-material/DeleteOutline';

function ArticleDeleteIcon({
                               onDeleteClick,
                               size,
                               color
                           }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.delete')}>
            <a href="#"
               onClick={onDeleteClick}>
               <DeleteIcon color={color}
                           fontSize={size}/>
            </a>
         </span>
    );
}


ArticleDeleteIcon.propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

ArticleDeleteIcon.defaultProps = {
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleDeleteIcon);
