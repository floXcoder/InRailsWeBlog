'use strict';

const ArticleEditIcon = ({article, onEditClick}) => {
    // TODO: use user global state
    // if ($app.isUserConnected(article.user.id)) {
    //     return (
    //         <a className="btn-floating article-edit tooltipped"
    //            data-tooltip={I18n.t('js.article.tooltip.edit')}
    //            onClick={onEditClick}>
    //<span className="material-icons"
    //      data-icon="mode_edit"
    //      aria-hidden="true"/>
    //         </a>
    //     );
    // } else {
        return null;
    // }
};

ArticleEditIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    onEditClick: PropTypes.func
};

export default ArticleEditIcon;
