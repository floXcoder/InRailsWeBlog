'use strict';

const ArticleEditionIcons = ({onSaveClick, onCancelClick, onDeleteClick, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <div className="article-editing">
            <a className="btn-floating article-delete tooltip-bottom"
               data-tooltip={I18n.t('js.article.tooltip.delete')}
               onClick={onDeleteClick}>
                    <span className="material-icons"
                          data-icon="delete"
                          aria-hidden="true"/>
            </a>

            <a className="article-cancel tooltip-bottom btn-floating"
               data-tooltip={I18n.t('js.article.tooltip.cancel')}
               onClick={onCancelClick}>
                    <span className="material-icons"
                          data-icon="clear"
                          aria-hidden="true"/>
            </a>

            <a className="btn-floating article-update tooltip-bottom"
               data-tooltip={I18n.t('js.article.tooltip.update')}
               onClick={onSaveClick}>
                   <span className="material-icons"
                         data-icon="check"
                         aria-hidden="true"/>
            </a>
        </div>
    );
};

ArticleEditionIcons.propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    isOwner: PropTypes.bool
};

ArticleEditionIcons.defaultProps = {
    isOwner: false
};

export default ArticleEditionIcons;
