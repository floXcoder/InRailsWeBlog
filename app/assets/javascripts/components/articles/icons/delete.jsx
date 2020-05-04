'use strict';

import DeleteIcon from '@material-ui/icons/DeleteOutline';

const ArticleDeleteIcon = ({onDeleteClick, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.delete')}>
        <a href="#"
           onClick={onDeleteClick}>
           <DeleteIcon color={color}
                       fontSize={size}/>
        </a>
    </span>
);


ArticleDeleteIcon.propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleDeleteIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleDeleteIcon);
