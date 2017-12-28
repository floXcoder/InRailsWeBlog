'use strict';

const ArticleDeleteIcon = ({onDeleteClick, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <a className="btn-floating tooltipped article-delete"
           data-tooltip={I18n.t('js.article.tooltip.delete')}
           onClick={onDeleteClick}>
               <span className="material-icons"
                     data-icon="delete"
                     aria-hidden="true"/>
        </a>
    );
};

ArticleDeleteIcon.propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    isOwner: PropTypes.bool
};

ArticleDeleteIcon.defaultProps = {
    isOwner: false
};

export default ArticleDeleteIcon;
