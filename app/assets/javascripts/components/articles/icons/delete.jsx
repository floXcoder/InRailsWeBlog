'use strict';

const ArticleDeleteIcon = ({onDeleteClick}) => (
    <a className="article-delete tooltipped"
       data-tooltip={I18n.t('js.article.tooltip.delete')}
       onClick={onDeleteClick}>
       <span className="material-icons"
             data-icon="delete"
             aria-hidden="true"/>
    </a>
);


ArticleDeleteIcon.propTypes = {
    onDeleteClick: PropTypes.func.isRequired
};

export default ArticleDeleteIcon;
