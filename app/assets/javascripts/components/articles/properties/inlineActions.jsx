'use strict';

import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

const ArticleInlineActions = ({classes, onSaveClick, onCancelClick, onDeleteClick, color, size}) => (
    <ul className={classes.actionButtons}>
        <li className={classNames('flow-tooltip-bottom', classes.actionItem)}
            data-tooltip={I18n.t('js.article.tooltip.delete')}>
            <a href="#"
               onClick={onDeleteClick}>
                <DeleteIcon color={color}
                            fontSize={size}/>
            </a>
        </li>

        <li className={classNames('flow-tooltip-bottom', classes.actionItem)}
            data-tooltip={I18n.t('js.article.tooltip.cancel')}>
            <a href="#"
               onClick={onCancelClick}>
                <ClearIcon color={color}
                           fontSize={size}/>
            </a>
        </li>

        <li className={classNames('flow-tooltip-bottom', classes.actionItem)}
            data-tooltip={I18n.t('js.article.tooltip.update')}>
            <a href="#"
               onClick={onSaveClick}>
                <SendIcon color={color}
                           fontSize="large"/>
            </a>
        </li>
    </ul>
);

ArticleInlineActions.propTypes = {
    classes: PropTypes.object.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

ArticleInlineActions.defaultProps = {
    size: 'default',
    color: 'action'
};

export default React.memo(ArticleInlineActions);
