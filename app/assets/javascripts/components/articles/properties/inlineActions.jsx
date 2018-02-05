'use strict';

const ArticleInlineActions = ({onSaveClick, onCancelClick, onDeleteClick}) => (
    <ul className="action-icons">
        <li className="action-item">
            <a className="article-delete tooltipped"
               data-tooltip={I18n.t('js.article.tooltip.delete')}
               onClick={onDeleteClick}>
                <span className="material-icons"
                      data-icon="delete"
                      aria-hidden="true"/>
            </a>
        </li>

        <li className="action-item">
            <a className="article-cancel tooltipped"
               data-tooltip={I18n.t('js.article.tooltip.cancel')}
               onClick={onCancelClick}>
                <span className="material-icons"
                      data-icon="clear"
                      aria-hidden="true"/>
            </a>
        </li>

        <li className="action-item">
            <a className="article-save tooltipped"
               data-tooltip={I18n.t('js.article.tooltip.update')}
               onClick={onSaveClick}>
               <span className="material-icons"
                     data-icon="check"
                     aria-hidden="true"/>
            </a>
        </li>
    </ul>
);

ArticleInlineActions.propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired
};

export default ArticleInlineActions;
