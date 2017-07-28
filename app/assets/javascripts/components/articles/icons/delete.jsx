'use strict';

const ArticleDeleteIcon = ({article, onDeleteClick}) => {
    if ($app.isUserConnected(article.user.id)) {
        return (
            <a className="article-delete tooltipped btn-floating"
               data-tooltip={I18n.t('js.article.tooltip.delete')}
               onClick={onDeleteClick}>
                <i className="material-icons">delete</i>
            </a>
        );
    } else {
        return null;
    }
};

ArticleDeleteIcon.propTypes = {
    article: React.PropTypes.object.isRequired,
    onDeleteClick: React.PropTypes.func.isRequired
};

export default ArticleDeleteIcon;
