'use strict';

import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutline';


const ArticleInlineActions = function ({
                                           onSaveClick,
                                           onCancelClick,
                                           onDeleteClick,
                                           size = 'medium',
                                           color = 'action'
                                       }) {
    return (
        <ul className="article-inline-action-buttons">
            <li className="flow-tooltip-bottom article-inline-action-item"
                data-tooltip={I18n.t('js.article.tooltip.delete')}>
                <a href="#"
                   onClick={onDeleteClick}>
                    <DeleteIcon color={color}
                                fontSize={size}/>
                </a>
            </li>

            <li className="flow-tooltip-bottom article-inline-action-item"
                data-tooltip={I18n.t('js.article.tooltip.cancel')}>
                <a href="#"
                   onClick={onCancelClick}>
                    <ClearIcon color={color}
                               fontSize={size}/>
                </a>
            </li>

            <li className="flow-tooltip-bottom article-inline-action-item"
                data-tooltip={I18n.t('js.article.tooltip.update')}>
                <a href="#"
                   onClick={onSaveClick}>
                    <SendIcon color={color}
                              fontSize="large"/>
                </a>
            </li>
        </ul>
    );
};

ArticleInlineActions.propTypes = {
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

export default React.memo(ArticleInlineActions);
